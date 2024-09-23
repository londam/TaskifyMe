import { z } from "zod";

const schema = z.object({
  url: z.string().min(24),
});

export default schema;
