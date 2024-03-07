export const copyToClipboard = async (
  value: string | number
): Promise<boolean> => {
  try {
    await navigator?.clipboard?.writeText(value.toString())
    return true
  } catch (error) {
    return false
  }
}
