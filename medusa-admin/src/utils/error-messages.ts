export const getErrorMessage = (error: any) => {
  let msg = error?.response?.data?.message
  if (msg[0].message) {
    msg = msg[0].message
  }
  if (!msg) {
    msg = "Midagi läks valesti, proovige uuesti."
  }
  return msg
}
