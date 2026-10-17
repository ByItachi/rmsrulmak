#!/usr/bin/env python3
"""Remote deploy helper: run commands / upload files over SSH (paramiko).
Reads credentials from deploy/server.local.json (gitignored).
Usage:
  python deploy/ssh_run.py "command1" "command2" ...
  python deploy/ssh_run.py --put local remote
  python deploy/ssh_run.py --get remote local
"""
import json
import os
import posixpath
import stat
import sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

with open(os.path.join(BASE, 'deploy', 'server.local.json'), encoding='utf-8') as f:
    cfg = json.load(f)

import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(
    cfg['host'], port=cfg.get('sshPort', 22), username=cfg.get('sshUser', 'root'),
    password=cfg['sshPassword'], timeout=25, banner_timeout=25, auth_timeout=25,
)


def run(cmd: str, timeout: int = 480) -> int:
    stdin, stdout, stderr = client.exec_command(cmd, timeout=timeout, get_pty=True)
    out = stdout.read().decode('utf-8', 'replace')
    err = stderr.read().decode('utf-8', 'replace')
    code = stdout.channel.recv_exit_status()
    if out.strip():
        print(out.strip()[-14000:])
    if err.strip() and err.strip() != out.strip():
        print('STDERR:', err.strip()[-4000:])
    print(f'[exit={code}]')
    return code


def sftp():
    return client.open_sftp()


def put(local: str, remote: str) -> None:
    s = sftp()
    parts = remote.replace('\\', '/').split('/')
    cur = ''
    for p in parts[:-1]:
        cur = posixpath.join(cur, p)
        if cur and cur != '/':
            try:
                s.stat(cur)
            except FileNotFoundError:
                s.mkdir(cur)
    s.put(local, remote)
    s.close()
    print(f'uploaded {local} -> {remote}')


def get(remote: str, local: str) -> None:
    s = sftp()
    os.makedirs(os.path.dirname(os.path.abspath(local)), exist_ok=True)
    s.get(remote, local)
    s.close()
    print(f'downloaded {remote} -> {local}')


def main() -> int:
    args = sys.argv[1:]
    if not args:
        return 2
    if args[0] == '--put':
        put(args[1], args[2])
        return 0
    if args[0] == '--get':
        get(args[1], args[2])
        return 0
    if args[0] == '--upload-tree':
        # upload a whole local directory recursively (small configs only)
        local_root, remote_root = args[1], args[2]
        s = sftp()
        for root, _dirs, files in os.walk(local_root):
            rel = os.path.relpath(root, local_root).replace('\\', '/')
            rdir = remote_root if rel == '.' else posixpath.join(remote_root, rel)
            try:
                s.stat(rdir)
            except FileNotFoundError:
                s.makedirs(rdir) if hasattr(s, 'makedirs') else None
                parts = rdir.split('/')
                cur = ''
                for p in parts:
                    if not p:
                        continue
                    cur = posixpath.join(cur, p)
                    try:
                        s.stat(cur)
                    except FileNotFoundError:
                        s.mkdir(cur)
            for fn in files:
                lp = os.path.join(root, fn)
                rp = posixpath.join(rdir, fn)
                s.put(lp, rp)
                print(f'  + {rp}')
        s.close()
        return 0
    codes = [run(a) for a in args]
    return 0 if all(c == 0 for c in codes) else 1


if __name__ == '__main__':
    sys.exit(main())
