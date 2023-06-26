export function handleErrors(res: any, e: any) {
    res.status(400).json({error: e.message});
}
  