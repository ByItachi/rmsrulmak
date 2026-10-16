import { Router, type IRouter } from "express";
import { CreateContactMessageBody, CreateContactMessageResponse, CreateProductRequestBody, CreateProductRequestResponse } from "@workspace/api-zod";
import { db, contactMessagesTable, productRequestsTable } from "@workspace/db";
import { rateLimit } from "../middlewares/rateLimit";

const router: IRouter = Router();

const writeLimit = rateLimit({
  windowMs: 10 * 60_000,
  max: 10,
  message: "Çok fazla form gönderimi yapıldı. Lütfen biraz sonra tekrar deneyin.",
});

router.post("/contact-messages", writeLimit, async (req, res): Promise<void> => {
  const parsed = CreateContactMessageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [message] = await db
    .insert(contactMessagesTable)
    .values(parsed.data)
    .returning({ id: contactMessagesTable.id });

  res.status(201).json(
    CreateContactMessageResponse.parse({
      id: String(message.id),
      message: "Mesajınız alındı. En kısa sürede sizinle iletişime geçeceğiz.",
    }),
  );
});

router.post("/product-requests", writeLimit, async (req, res): Promise<void> => {
  const parsed = CreateProductRequestBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [request] = await db
    .insert(productRequestsTable)
    .values(parsed.data)
    .returning({ id: productRequestsTable.id });

  res.status(201).json(
    CreateProductRequestResponse.parse({
      id: String(request.id),
      message:
        "Ürün talebiniz alındı. Satış ekibimiz en kısa sürede size dönüş yapacak.",
    }),
  );
});

export default router;