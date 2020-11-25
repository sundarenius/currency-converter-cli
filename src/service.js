import https from 'https'

const GET = async (url) => {
  return new Promise(resolve => {
    https.get(url, (res) => {
      res.setEncoding('utf8')
      res.on('data', res => {
        resolve(res)
      })
    })
  })
}

export default GET
