import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const path = join(dirname(fileURLToPath(import.meta.url)), '../src/tabs/manutencao/servicosData.ts')
let content = readFileSync(path, 'utf8')
content = content.replaceAll('"sinistro2"', '"singra2"')
content = content.replaceAll('"aguardando"', '"pendante"')
writeFileSync(path, content)
console.log('Migração SINGRA 2 concluída.')
