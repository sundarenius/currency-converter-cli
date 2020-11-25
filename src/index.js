import service from './service.js'
import chalk from 'chalk'
import ora from 'ora'
import GET from './service.js'

const args = process.argv.splice(2)

const spinner = ora('Getting data').start()

const types = {
  _CURRENCIES_: 'currencies'
}

const logCurrencies = (_currencies) => {
  const currencies = JSON.parse(_currencies)
  console.log(currencies)
  for (let c in currencies) {
    console.log(`Currency code: "${chalk.green(c)}" is for ${chalk.blue(currencies[c])}`)
  }
}

const getCurrencies = async () => {
  try {
    const res = await GET(`https://openexchangerates.org/api/currencies.json`)
    spinner.succeed()
    logCurrencies(res)
  } catch (err) {
    spinner.fail()
  }
}

const formatAmount = (amount, currency) => {
  const number = 123456.789

  return new Intl.NumberFormat('ja-JP',  {
    style: 'currency',
    currency,
  }).format(amount)
}

const noArgsMessage = () => {
  spinner.stop()
  console.log(`Hi, you did not provide any amount and/or ${types._CURRENCIES_}.`)
  console.log(`To see available currency codes, type "node index.js ${types._CURRENCIES_}"`)
  console.log('Example command, "node index.js 15 EUR USD"')
  console.log('That would convert 15 EUR to USD')
}

const calculate = (data, amount, base, toCurrency) => {
  const { rates } = data
  const toCurrencyValue = rates[toCurrency]
  const calulated = formatAmount((Number(amount) * Number(toCurrencyValue)).toFixed(2), toCurrency)

  console.log('')
  console.log(`${amount} ${base} is equal to ${chalk.green(calulated)}`)
}

const _START_ = async (args) => {
  let _amount = null
  const isNr = (arg) => {
    const nr = Number(arg)
    _amount = nr
    return nr
  }
  const amount = (args[0] && isNr(args[0]) && _amount) || 1
  const base = (args[1] && args[1].toUpperCase()) || 'USD'
  const toCurrency = (args[2] && args[2].toUpperCase()) || 'EUR'

  if (args.length === 0) {
    spinner.stop()
    noArgsMessage()
  } else if (args[0] === types._CURRENCIES_) {
    spinner.stop()
    await getCurrencies()
  } else {
    const res = await GET(`https://api.exchangeratesapi.io/latest?base=${base}&symbols=${toCurrency}`)
    spinner.succeed()
    await calculate(JSON.parse(res), amount, base, toCurrency)
  }
}

_START_(args)
