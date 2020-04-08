export async function sleep(t: number) {
    return new Promise((solve) => {
        setTimeout(() => {
            solve()
        }, t);
    })
}
