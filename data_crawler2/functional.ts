const fst = <T,>([a, _]: [T, any]): T => a
const snd = <T,>([_, a]: [T, any]): T => a

const seq = (start: number, end: number, step = 1): number[] => Array.from({ length: Math.floor((end - start)/step) }, (_, i) => start + i * step)
const notN = (n: number, i: number): boolean => n !== i

export {
  seq,
  notN,
}