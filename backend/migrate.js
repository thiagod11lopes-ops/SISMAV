const fs = require('fs-extra');
const path = require('path');

/**
 * Script para migrar dados do localStorage (via arquivo JSON exportado) para o backend
 * 
 * Uso:
 * 1. No navegador, exporte os dados do localStorage como JSON
 * 2. Salve o arquivo como 'localStorage_backup.json' na pasta backend
 * 3. Execute: node migrate.js
 */

async function migrateFromLocalStorage() {
    try {
        const backupPath = path.join(__dirname, 'localStorage_backup.json');
        const dataDir = path.join(__dirname, 'data');
        
        if (!fs.existsSync(backupPath)) {
            console.log('❌ Arquivo localStorage_backup.json não encontrado!');
            console.log('   Por favor, exporte os dados do localStorage e salve como localStorage_backup.json na pasta backend');
            return;
        }

        console.log('📦 Lendo backup do localStorage...');
        const backupData = JSON.parse(await fs.readFile(backupPath, 'utf8'));
        
        console.log('💾 Migrando dados para o backend...');
        
        // Garantir que o diretório de dados existe
        await fs.ensureDir(dataDir);
        
        let migrated = 0;
        
        // Migrar cada chave do localStorage
        for (const [key, value] of Object.entries(backupData)) {
            const filePath = path.join(dataDir, `${key}.json`);
            
            // Converter para array se necessário
            let dataToSave = value;
            if (!Array.isArray(value)) {
                dataToSave = [value];
            }
            
            await fs.writeFile(filePath, JSON.stringify(dataToSave, null, 2));
            console.log(`   ✅ Migrado: ${key} (${dataToSave.length} itens)`);
            migrated++;
        }
        
        console.log(`\n✅ Migração concluída! ${migrated} arquivos migrados.`);
        console.log(`📁 Dados salvos em: ${dataDir}`);
        
    } catch (error) {
        console.error('❌ Erro na migração:', error);
    }
}

migrateFromLocalStorage();










