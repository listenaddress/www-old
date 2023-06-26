const client = require("@mailchimp/mailchimp_marketing");

client.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY,
    server: "us20",
});

export default async function handler(req: any, res: any) {
    const { email, stream } = req.body;
    console.log('Request for access from:', email)
    if (stream) {
        console.log('They are requesting access to:', stream)
    }

    let objectToSave: any = {
        email_address: email,
        status: "subscribed",
    }

    if (stream) {
        objectToSave['tags'] = [stream]
    }

    try {
        await client.lists.addListMember(process.env.MAILCHIMP_LIST_ID, objectToSave);
        res.status(201).json({ message: "Success" });
    } catch (error: any) {
        console.log("Error for email:", email)
        console.log("The error:", error.response.text)
        res.status(500).json({ error: error });
    }
}
