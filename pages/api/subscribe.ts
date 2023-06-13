import { privateClient } from "@/client/sanity";
export default async (
  req: { method: string; body: { email: any } },
  res: {
    status: (arg0: number) => {
      (): any;
      new (): any;
      json: { (arg0: { message: string }): any; new (): any };
    };
  }
) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    await privateClient.create({
      _type: "subscriber",
      email: email,
    });

    return res.status(200).json({ message: "Success" });
  } catch (err) {
    console.error(err);

    return res.status(500).json({ message: "Error" });
  }
};
