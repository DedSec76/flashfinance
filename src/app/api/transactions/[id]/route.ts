export async function GET() {
    return Response.json(
        {
            error: {
                code: "NOT_IMPLEMENTED",
                message: "Transaction by ID endpoint is not implemented yet.",
            },
        },
        { status: 501 },
    );
}