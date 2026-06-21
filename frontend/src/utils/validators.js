export function required(value, fieldName = 'This field') {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} is required`
  }
  return ''
}

export function email(value) {
  if (!value) return ''
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!re.test(value)) return 'Invalid email address'
  return ''
}

export function positiveNumber(value) {
  if (!value) return ''
  const num = parseFloat(value)
  if (isNaN(num) || num <= 0) return 'Must be a positive number'
  return ''
}

export function validateForm(values, rules) {
  const errors = {}
  for (const [field, validators] of Object.entries(rules)) {
    for (const fn of validators) {
      const err = fn(values[field])
      if (err) {
        errors[field] = err
        break
      }
    }
  }
  return errors
}
