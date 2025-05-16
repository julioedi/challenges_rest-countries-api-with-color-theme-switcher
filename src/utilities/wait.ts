
const wait = async (time:number = 0.3) => {
  await new Promise(res => {
    setTimeout(() => {
      res(true)
    }, time * 1000)
  })
}
export {wait}