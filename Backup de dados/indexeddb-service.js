/**
 * Serviço IndexedDB para SISMAV
 * Substitui o uso do localStorage por IndexedDB para melhor performance e capacidade
 */

const DB_NAME = 'SISMAV_DB';
const DB_VERSION = 1;
const STORE_NAME = 'sismav_data';

class IndexedDBService {
    constructor() {
        this.db = null;
        this.initPromise = null;
    }

    /**
     * Inicializa o banco de dados IndexedDB
     */
    async init() {
        if (this.db) {
            return this.db;
        }

        if (this.initPromise) {
            return this.initPromise;
        }

        this.initPromise = new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => {
                console.error('Erro ao abrir IndexedDB:', request.error);
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Criar object store se não existir
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'key' });
                    console.log('Object store criado:', STORE_NAME);
                }
            };
        });

        return this.initPromise;
    }

    /**
     * Garante que o banco está inicializado
     */
    async ensureInit() {
        if (!this.db) {
            await this.init();
        }
    }

    /**
     * Obtém um valor do IndexedDB
     * @param {string} key - Chave do dado
     * @returns {Promise<any>} - Valor armazenado ou null
     */
    async get(key) {
        try {
            await this.ensureInit();
            
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction([STORE_NAME], 'readonly');
                const store = transaction.objectStore(STORE_NAME);
                const request = store.get(key);

                request.onsuccess = () => {
                    const result = request.result;
                    if (result && result.value !== undefined) {
                        resolve(result.value);
                    } else {
                        resolve(null);
                    }
                };

                request.onerror = () => {
                    console.error('Erro ao obter dado do IndexedDB:', request.error);
                    reject(request.error);
                };
            });
        } catch (error) {
            console.error('Erro ao obter dado:', error);
            return null;
        }
    }

    /**
     * Salva um valor no IndexedDB
     * @param {string} key - Chave do dado
     * @param {any} value - Valor a ser armazenado
     * @returns {Promise<void>}
     */
    async set(key, value) {
        try {
            await this.ensureInit();
            
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction([STORE_NAME], 'readwrite');
                const store = transaction.objectStore(STORE_NAME);
                const request = store.put({ key, value });

                request.onsuccess = () => {
                    resolve();
                };

                request.onerror = () => {
                    console.error('Erro ao salvar dado no IndexedDB:', request.error);
                    reject(request.error);
                };
            });
        } catch (error) {
            console.error('Erro ao salvar dado:', error);
            throw error;
        }
    }

    /**
     * Remove um valor do IndexedDB
     * @param {string} key - Chave do dado a ser removido
     * @returns {Promise<void>}
     */
    async remove(key) {
        try {
            await this.ensureInit();
            
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction([STORE_NAME], 'readwrite');
                const store = transaction.objectStore(STORE_NAME);
                const request = store.delete(key);

                request.onsuccess = () => {
                    resolve();
                };

                request.onerror = () => {
                    console.error('Erro ao remover dado do IndexedDB:', request.error);
                    reject(request.error);
                };
            });
        } catch (error) {
            console.error('Erro ao remover dado:', error);
            throw error;
        }
    }

    /**
     * Remove todos os dados do IndexedDB
     * @returns {Promise<void>}
     */
    async clear() {
        try {
            await this.ensureInit();
            
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction([STORE_NAME], 'readwrite');
                const store = transaction.objectStore(STORE_NAME);
                const request = store.clear();

                request.onsuccess = () => {
                    resolve();
                };

                request.onerror = () => {
                    console.error('Erro ao limpar IndexedDB:', request.error);
                    reject(request.error);
                };
            });
        } catch (error) {
            console.error('Erro ao limpar IndexedDB:', error);
            throw error;
        }
    }

    /**
     * Obtém todas as chaves armazenadas
     * @returns {Promise<string[]>}
     */
    async getAllKeys() {
        try {
            await this.ensureInit();
            
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction([STORE_NAME], 'readonly');
                const store = transaction.objectStore(STORE_NAME);
                const request = store.getAllKeys();

                request.onsuccess = () => {
                    resolve(request.result);
                };

                request.onerror = () => {
                    console.error('Erro ao obter chaves do IndexedDB:', request.error);
                    reject(request.error);
                };
            });
        } catch (error) {
            console.error('Erro ao obter chaves:', error);
            return [];
        }
    }

    /**
     * Obtém todos os dados armazenados
     * @returns {Promise<Array<{key: string, value: any}>>}
     */
    async getAll() {
        try {
            await this.ensureInit();
            
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction([STORE_NAME], 'readonly');
                const store = transaction.objectStore(STORE_NAME);
                const request = store.getAll();

                request.onsuccess = () => {
                    resolve(request.result);
                };

                request.onerror = () => {
                    console.error('Erro ao obter todos os dados do IndexedDB:', request.error);
                    reject(request.error);
                };
            });
        } catch (error) {
            console.error('Erro ao obter todos os dados:', error);
            return [];
        }
    }

    /**
     * Calcula o tamanho aproximado dos dados armazenados
     * @returns {Promise<number>} - Tamanho em bytes
     */
    async getStorageSize() {
        try {
            const allData = await this.getAll();
            let totalSize = 0;

            for (const item of allData) {
                // Calcular tamanho aproximado serializando para JSON
                const keySize = new Blob([item.key]).size;
                const valueSize = new Blob([JSON.stringify(item.value)]).size;
                totalSize += keySize + valueSize;
            }

            return totalSize;
        } catch (error) {
            console.error('Erro ao calcular tamanho do armazenamento:', error);
            return 0;
        }
    }

    /**
     * Obtém uma estimativa de uso do armazenamento
     * @returns {Promise<{used: number, quota: number, percentage: number}>}
     */
    async getStorageEstimate() {
        try {
            if ('storage' in navigator && 'estimate' in navigator.storage) {
                const estimate = await navigator.storage.estimate();
                const used = await this.getStorageSize();
                const quota = estimate.quota || (50 * 1024 * 1024 * 1024); // 50GB padrão se não disponível
                const percentage = (used / quota) * 100;

                return {
                    used,
                    quota,
                    percentage: Math.min(100, percentage)
                };
            } else {
                // Fallback para estimativa padrão
                const used = await this.getStorageSize();
                const quota = 50 * 1024 * 1024 * 1024; // 50GB
                const percentage = (used / quota) * 100;

                return {
                    used,
                    quota,
                    percentage: Math.min(100, percentage)
                };
            }
        } catch (error) {
            console.error('Erro ao obter estimativa de armazenamento:', error);
            return {
                used: 0,
                quota: 50 * 1024 * 1024 * 1024,
                percentage: 0
            };
        }
    }
}

// Criar instância global
const indexedDBService = new IndexedDBService();

// Inicializar quando o script carregar
indexedDBService.init().catch(err => {
    console.error('Erro ao inicializar IndexedDB:', err);
});

// Funções de compatibilidade para usar apenas IndexedDB
window.getData = async function(key) {
    try {
        const value = await indexedDBService.get(key);
        
        // Se não encontrar no IndexedDB, tentar localStorage apenas para migração única
        if (value === null || value === undefined) {
            const localValue = localStorage.getItem(key);
            if (localValue !== null) {
                // Migrar do localStorage para IndexedDB (apenas uma vez)
                try {
                    const parsed = JSON.parse(localValue);
                    await indexedDBService.set(key, parsed);
                    // Remover do localStorage após migração bem-sucedida
                    localStorage.removeItem(key);
                    return parsed;
                } catch (e) {
                    // Se não for JSON, tentar como string
                    await indexedDBService.set(key, localValue);
                    localStorage.removeItem(key);
                    return localValue;
                }
            }
        }
        
        return value || [];
    } catch (error) {
        console.error(`Erro ao obter ${key}:`, error);
        return [];
    }
};

window.setData = async function(key, value) {
    try {
        await indexedDBService.set(key, value);
    } catch (error) {
        console.error(`Erro ao salvar ${key}:`, error);
        throw error;
    }
};

window.removeData = async function(key) {
    try {
        await indexedDBService.remove(key);
    } catch (error) {
        console.error(`Erro ao remover ${key}:`, error);
        throw error;
    }
};

window.clearAllData = async function() {
    try {
        await indexedDBService.clear();
    } catch (error) {
        console.error('Erro ao limpar dados:', error);
        throw error;
    }
};

// Função para migrar todos os dados do localStorage para IndexedDB
window.migrateLocalStorageToIndexedDB = async function() {
    try {
        console.log('🔄 Iniciando migração do localStorage para IndexedDB...');
        
        const keysToMigrate = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key) {
                keysToMigrate.push(key);
            }
        }

        let migratedCount = 0;
        for (const key of keysToMigrate) {
            try {
                // Verificar se já existe no IndexedDB
                const existing = await indexedDBService.get(key);
                if (existing === null || existing === undefined) {
                    const value = localStorage.getItem(key);
                    if (value !== null) {
                        try {
                            const parsed = JSON.parse(value);
                            await indexedDBService.set(key, parsed);
                            migratedCount++;
                            console.log(`✅ Migrado: ${key}`);
                        } catch (e) {
                            // Se não for JSON válido, salvar como string
                            await indexedDBService.set(key, value);
                            migratedCount++;
                            console.log(`✅ Migrado (string): ${key}`);
                        }
                    }
                }
            } catch (e) {
                console.error(`Erro ao migrar ${key}:`, e);
            }
        }

        if (migratedCount > 0) {
            console.log(`✅ Migração concluída! ${migratedCount} item(s) migrado(s)`);
        } else {
            console.log('ℹ️ Nenhum dado novo para migrar');
        }

        return migratedCount;
    } catch (error) {
        console.error('Erro na migração:', error);
        return 0;
    }
};

// Executar migração automática quando o script carregar
(async function() {
    try {
        await indexedDBService.init();
        // Aguardar um pouco para garantir que tudo está carregado
        setTimeout(async () => {
            await window.migrateLocalStorageToIndexedDB();
        }, 1000);
    } catch (e) {
        console.error('Erro na migração automática:', e);
    }
})();

// Exportar para uso global
window.indexedDBService = indexedDBService;

// Função de debug para verificar dados no IndexedDB
window.verificarIndexedDB = async function() {
    try {
        console.log('🔍 Verificando dados no IndexedDB...\n');
        
        await indexedDBService.ensureInit();
        
        // Obter todas as chaves
        const allKeys = await indexedDBService.getAllKeys();
        console.log(`📊 Total de chaves armazenadas: ${allKeys.length}\n`);
        
        if (allKeys.length === 0) {
            console.log('⚠️ Nenhum dado encontrado no IndexedDB');
            console.log('💡 Verificando localStorage...');
            
            const localKeys = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key) localKeys.push(key);
            }
            
            if (localKeys.length > 0) {
                console.log(`📦 Encontrados ${localKeys.length} itens no localStorage que podem ser migrados`);
                console.log('Chaves no localStorage:', localKeys);
                console.log('\n💡 Execute: await window.migrateLocalStorageToIndexedDB() para migrar os dados');
            }
            return;
        }
        
        console.log('📋 Chaves armazenadas:');
        allKeys.forEach((key, index) => {
            console.log(`   ${index + 1}. ${key}`);
        });
        
        // Obter todos os dados
        const allData = await indexedDBService.getAll();
        console.log('\n📦 Dados armazenados:');
        
        for (const item of allData) {
            const value = item.value;
            let preview = '';
            
            if (Array.isArray(value)) {
                preview = `Array com ${value.length} item(s)`;
                if (value.length > 0) {
                    preview += ` - Primeiro item: ${JSON.stringify(value[0]).substring(0, 100)}...`;
                }
            } else if (typeof value === 'object' && value !== null) {
                preview = `Objeto com ${Object.keys(value).length} propriedade(s)`;
            } else if (typeof value === 'string') {
                preview = `String: ${value.substring(0, 100)}${value.length > 100 ? '...' : ''}`;
            } else {
                preview = String(value);
            }
            
            console.log(`\n   🔑 ${item.key}:`);
            console.log(`      ${preview}`);
        }
        
        // Calcular tamanho
        const size = await indexedDBService.getStorageSize();
        const estimate = await indexedDBService.getStorageEstimate();
        
        console.log('\n💾 Estatísticas de Armazenamento:');
        console.log(`   Usado: ${(size / 1024).toFixed(2)} KB`);
        console.log(`   Quota disponível: ${(estimate.quota / (1024 * 1024 * 1024)).toFixed(2)} GB`);
        console.log(`   Percentual usado: ${estimate.percentage.toFixed(4)}%`);
        
        console.log('\n✅ Verificação concluída!');
        
        return {
            keys: allKeys,
            data: allData,
            size: size,
            estimate: estimate
        };
    } catch (error) {
        console.error('❌ Erro ao verificar IndexedDB:', error);
        return null;
    }
};

// Função para comparar localStorage vs IndexedDB
window.compararArmazenamento = async function() {
    console.log('🔍 Comparando localStorage vs IndexedDB...\n');
    
    // Verificar localStorage
    const localKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) localKeys.push(key);
    }
    
    console.log(`📦 localStorage: ${localKeys.length} chave(s)`);
    if (localKeys.length > 0) {
        console.log('   Chaves:', localKeys);
    }
    
    // Verificar IndexedDB
    try {
        await indexedDBService.ensureInit();
        const indexedKeys = await indexedDBService.getAllKeys();
        
        console.log(`\n💾 IndexedDB: ${indexedKeys.length} chave(s)`);
        if (indexedKeys.length > 0) {
            console.log('   Chaves:', indexedKeys);
        }
        
        // Comparar
        console.log('\n📊 Comparação:');
        const apenasLocal = localKeys.filter(k => !indexedKeys.includes(k));
        const apenasIndexed = indexedKeys.filter(k => !localKeys.includes(k));
        const emAmbos = localKeys.filter(k => indexedKeys.includes(k));
        
        if (apenasLocal.length > 0) {
            console.log(`⚠️ ${apenasLocal.length} chave(s) apenas no localStorage (precisam migração):`, apenasLocal);
        }
        
        if (apenasIndexed.length > 0) {
            console.log(`✅ ${apenasIndexed.length} chave(s) apenas no IndexedDB:`, apenasIndexed);
        }
        
        if (emAmbos.length > 0) {
            console.log(`🔄 ${emAmbos.length} chave(s) em ambos:`, emAmbos);
        }
        
        if (apenasLocal.length === 0 && apenasIndexed.length === 0 && emAmbos.length === 0) {
            console.log('ℹ️ Nenhum dado encontrado em nenhum dos dois');
        }
        
    } catch (error) {
        console.error('❌ Erro ao verificar IndexedDB:', error);
    }
};

