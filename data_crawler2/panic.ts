
const panic = (str: string) => {
  const stat = Statistics.instance
  stat.dump()
  stat.print()
  console.error(str)
  process.exit(-1)
}