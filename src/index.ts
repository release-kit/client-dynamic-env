export function parseEnvBase64(source: unknown) {
  if (typeof source !== 'string') {
    throw new TypeError('[CDE] Expected productionSource to be string')
  }

  let parsed: Record<string, string>

  try {
    const json = atob(source)
    parsed = JSON.parse(json)
  } catch {
    throw new Error('[CDE] Failed to parse productionSource')
  }

  return parsed
}

interface Options<T> {
  env: 'development' | 'production'
  developmentEnv: Record<string, string>
  productionSource: unknown
  validate: (parsed: Record<string, string>) => T
}

export function extractEnv<T>({
  env,
  developmentEnv,
  productionSource,
  validate,
}: Options<T>) {
  const parsed =
    env === 'production' ? parseEnvBase64(productionSource) : developmentEnv

  return validate(parsed)
}
