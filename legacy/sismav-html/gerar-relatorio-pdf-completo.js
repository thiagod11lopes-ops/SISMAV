const fs = require('fs');
const path = require('path');

// Verificar se puppeteer está instalado
let puppeteer;
try {
    puppeteer = require('puppeteer');
} catch (e) {
    console.error('❌ Puppeteer não está instalado!');
    console.log('\n📦 Instalando puppeteer...');
    console.log('Execute: npm install puppeteer');
    console.log('\nOu use o script alternativo que gera HTML e você pode converter manualmente.');
    process.exit(1);
}

// Caminho do arquivo de backup
const backupPath = 'C:\\Users\\anamr\\Downloads\\SISMAV_Backup_2026-02-06T14-16-02.json';
const outputPath = 'C:\\Users\\anamr\\Downloads\\Relatorio_SISMAV_2026-02-06.pdf';

// Função para calcular dias
function calcularDiasRelatorio(dataSaida, dataRetorno) {
    if (!dataSaida) return 0;
    const saida = new Date(dataSaida + 'T00:00:00');
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    if (dataRetorno && dataRetorno.trim() !== '') {
        const retorno = new Date(dataRetorno + 'T00:00:00');
        const diffTime = Math.abs(retorno - saida);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } else {
        const diffTime = Math.abs(hoje - saida);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
}

// Função para formatar data
function formatarDataRelatorio(dateStr) {
    if (!dateStr) return '-';
    try {
        if (dateStr.includes('T') || dateStr.includes('Z')) {
            return new Date(dateStr).toLocaleDateString('pt-BR');
        }
        return new Date(dateStr + 'T00:00:00').toLocaleDateString('pt-BR');
    } catch (e) {
        return dateStr;
    }
}

// Função para escapar HTML
function escapeHtml(text) {
    if (!text) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Função para encontrar viatura por placa
function encontrarViaturaPorPlaca(viaturas, placa) {
    if (!Array.isArray(viaturas) || !placa) return null;
    return viaturas.find(v => v.placa === placa) || null;
}

// Função principal para gerar HTML do relatório
function gerarHTMLRelatorio(dados) {
    const viaturasOficina = dados.viaturasOficina || [];
    const viaturas = dados.viaturasCadastradas || [];
    const fainasPendentes = dados.fainas_pendentes || [];
    const fainasAndamento = dados.fainas_andamento || [];
    const fainasFinalizadas = dados.fainas_finalizadas || [];
    const manutencoes = dados.manutencoesCadastradas || [];
    const anotacoesServicos = dados.anotacoesServicos || [];

    let html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório Semanal - Divisão de Transporte</title>
    <style>
        @page {
            margin: 2cm;
            size: A4;
        }
        body {
            font-family: Arial, sans-serif;
            font-size: 11px;
            line-height: 1.4;
            color: #1f2937;
            margin: 0;
            padding: 20px;
        }
        h2 {
            text-align: center;
            color: #1f2937;
            margin-bottom: 10px;
            font-size: 22px;
            font-weight: bold;
        }
        h3 {
            text-align: center;
            color: #2563eb;
            margin-bottom: 10px;
            font-size: 18px;
            font-weight: bold;
        }
        h4 {
            text-align: center;
            color: #2563eb;
            margin-bottom: 15px;
            font-size: 16px;
            font-weight: bold;
        }
        .section-title {
            color: #6b7280;
            margin-top: 15px;
            margin-bottom: 20px;
            font-size: 14px;
            text-align: center;
        }
        .header-info {
            background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(247,250,252,0.95) 100%);
            padding: 25px;
            border-radius: 12px;
            margin-bottom: 20px;
            border: 2px solid #e5e7eb;
        }
        .section {
            background: #ffffff;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            page-break-inside: avoid;
        }
        .section h3 {
            color: inherit;
            margin-bottom: 12px;
            font-size: 16px;
            border-bottom: 2px solid;
            padding-bottom: 8px;
            text-align: left;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            font-size: 10px;
        }
        th {
            padding: 8px;
            text-align: left;
            border: 1px solid #ddd;
            background: inherit;
            color: white;
            font-weight: bold;
            font-size: 10px;
        }
        td {
            padding: 6px;
            border: 1px solid #ddd;
            font-size: 10px;
        }
        tr:nth-child(even) {
            background: #f9fafb;
        }
        .footer {
            text-align: center;
            padding: 15px;
            color: #6b7280;
            font-size: 10px;
            border-top: 1px solid #e5e7eb;
            margin-top: 20px;
        }
        .no-data {
            text-align: center;
            color: #6b7280;
            padding: 15px;
            font-style: italic;
        }
    </style>
</head>
<body>
    <div class="header-info">
        <h2>MARINHA DO BRASIL</h2>
        <h3>HOSPITAL NAVAL MARCÍLIO DIAS</h3>
        <h4>DIVISÃO DE TRANSPORTE</h4>
        <h4 class="section-title">RELATÓRIO SEMANAL</h4>
        <p style="text-align: center; color: #4b5563; font-size: 12px; margin-bottom: 20px;">
            Gerado em: <strong>${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</strong>
        </p>
    </div>
`;

    // Separar viaturas: Na Oficina e Finalizadas (últimos 10 dias)
    const hoje = new Date();
    hoje.setHours(23, 59, 59, 999);
    const dezDiasAtras = new Date(hoje);
    dezDiasAtras.setDate(hoje.getDate() - 10);
    dezDiasAtras.setHours(0, 0, 0, 0);

    const viaturasNaOficina = viaturasOficina.filter(v => !v.dataRetorno || v.dataRetorno.trim() === '');
    const viaturasFinalizadas = viaturasOficina.filter(v => {
        if (!v.dataRetorno || v.dataRetorno.trim() === '') return false;
        try {
            const dataRetorno = new Date(v.dataRetorno + 'T00:00:00');
            return dataRetorno >= dezDiasAtras && dataRetorno <= hoje;
        } catch (e) {
            return false;
        }
    });

    // Seção de Viaturas na Oficina
    html += `
    <div class="section">
        <h3 style="color: #8b5cf6; border-color: #8b5cf6;">VIATURAS NA OFICINA</h3>
        <table>
            <thead>
                <tr style="background: #8b5cf6;">
                    <th>Placa</th>
                    <th>Data Saída</th>
                    <th>Data Retorno</th>
                    <th>Dias</th>
                    <th>Descrição do Serviço</th>
                </tr>
            </thead>
            <tbody>
`;
    if (viaturasNaOficina.length > 0) {
        viaturasNaOficina.forEach((v) => {
            const viatura = encontrarViaturaPorPlaca(viaturas, v.placa) || {};
            const placaTexto = v.placa + (viatura.modelo ? ` (${viatura.modelo})` : '');
            const dataSaida = formatarDataRelatorio(v.dataSaida);
            const dias = calcularDiasRelatorio(v.dataSaida, v.dataRetorno);
            const diasTexto = `${dias} dia(s) (em andamento)`;
            html += `
                <tr>
                    <td>${escapeHtml(placaTexto)}</td>
                    <td>${dataSaida}</td>
                    <td><span style="color: #f59e0b; font-weight: bold;">Em andamento</span></td>
                    <td><strong>${diasTexto}</strong></td>
                    <td>${escapeHtml(v.descricaoServico || '-')}</td>
                </tr>
            `;
        });
    } else {
        html += `
                <tr>
                    <td colspan="5" class="no-data">Nenhuma viatura registrada na oficina</td>
                </tr>
        `;
    }
    html += `
            </tbody>
        </table>
    </div>
`;

    // Seção de Viaturas Finalizadas
    html += `
    <div class="section">
        <h3 style="color: #10b981; border-color: #10b981;">VIATURAS FINALIZADAS (Últimos 10 dias)</h3>
        <table>
            <thead>
                <tr style="background: #10b981;">
                    <th>Placa</th>
                    <th>Data Saída</th>
                    <th>Data Retorno</th>
                    <th>Dias</th>
                    <th>Descrição do Serviço</th>
                </tr>
            </thead>
            <tbody>
`;
    if (viaturasFinalizadas.length > 0) {
        viaturasFinalizadas.forEach((v) => {
            const viatura = encontrarViaturaPorPlaca(viaturas, v.placa) || {};
            const placaTexto = v.placa + (viatura.modelo ? ` (${viatura.modelo})` : '');
            const dataSaida = formatarDataRelatorio(v.dataSaida);
            const dataRetorno = formatarDataRelatorio(v.dataRetorno);
            const dias = calcularDiasRelatorio(v.dataSaida, v.dataRetorno);
            html += `
                <tr>
                    <td>${escapeHtml(placaTexto)}</td>
                    <td>${dataSaida}</td>
                    <td>${dataRetorno}</td>
                    <td><strong>${dias} dia(s)</strong></td>
                    <td>${escapeHtml(v.descricaoServico || '-')}</td>
                </tr>
            `;
        });
    } else {
        html += `
                <tr>
                    <td colspan="5" class="no-data">Nenhuma viatura finalizada nos últimos 10 dias</td>
                </tr>
        `;
    }
    html += `
            </tbody>
        </table>
    </div>
`;

    // Seção de Atividades Pendentes
    html += `
    <div class="section">
        <h3 style="color: #f59e0b; border-color: #f59e0b;">ATIVIDADES PENDENTES</h3>
        <table>
            <thead>
                <tr style="background: #f59e0b;">
                    <th>Título</th>
                    <th>Descrição</th>
                    <th>Data de Adicionamento</th>
                </tr>
            </thead>
            <tbody>
`;
    if (fainasPendentes.length > 0) {
        fainasPendentes.forEach((f) => {
            html += `
                <tr>
                    <td><strong>${escapeHtml(f.titulo || '-')}</strong></td>
                    <td>${escapeHtml(f.descricao || '-')}</td>
                    <td>${formatarDataRelatorio(f.dataAdicionamento)}</td>
                </tr>
            `;
        });
    } else {
        html += `
                <tr>
                    <td colspan="3" class="no-data">Nenhuma atividade pendente registrada</td>
                </tr>
        `;
    }
    html += `
            </tbody>
        </table>
    </div>
`;

    // Seção de Atividades em Andamento
    html += `
    <div class="section">
        <h3 style="color: #3b82f6; border-color: #3b82f6;">ATIVIDADES EM ANDAMENTO</h3>
        <table>
            <thead>
                <tr style="background: #3b82f6;">
                    <th>Título</th>
                    <th>Descrição</th>
                    <th>Data de Início</th>
                </tr>
            </thead>
            <tbody>
`;
    if (fainasAndamento.length > 0) {
        fainasAndamento.forEach((f) => {
            html += `
                <tr>
                    <td><strong>${escapeHtml(f.titulo || '-')}</strong></td>
                    <td>${escapeHtml(f.descricao || '-')}</td>
                    <td>${formatarDataRelatorio(f.dataInicio)}</td>
                </tr>
            `;
        });
    } else {
        html += `
                <tr>
                    <td colspan="3" class="no-data">Nenhuma atividade em andamento registrada</td>
                </tr>
        `;
    }
    html += `
            </tbody>
        </table>
    </div>
`;

    // Seção de Atividades Finalizadas
    html += `
    <div class="section">
        <h3 style="color: #10b981; border-color: #10b981;">ATIVIDADES FINALIZADAS</h3>
        <table>
            <thead>
                <tr style="background: #10b981;">
                    <th>Título</th>
                    <th>Descrição</th>
                    <th>Data de Finalização</th>
                </tr>
            </thead>
            <tbody>
`;
    if (fainasFinalizadas.length > 0) {
        fainasFinalizadas.forEach((f) => {
            html += `
                <tr>
                    <td><strong>${escapeHtml(f.titulo || '-')}</strong></td>
                    <td>${escapeHtml(f.descricao || '-')}</td>
                    <td>${formatarDataRelatorio(f.dataFinalizacao)}</td>
                </tr>
            `;
        });
    } else {
        html += `
                <tr>
                    <td colspan="3" class="no-data">Nenhuma atividade finalizada registrada</td>
                </tr>
        `;
    }
    html += `
            </tbody>
        </table>
    </div>
`;

    // Seção de Serviços Não Aprovados
    const servicosNaoAprovados = manutencoes.filter(servico => 
        servico.faturamento === 'Não Aprovados' && 
        (servico.tipo === 'Ambulância' || servico.tipo === 'Administrativa')
    );

    html += `
    <div class="section">
        <h3 style="color: #ef4444; border-color: #ef4444;">SERVIÇOS NÃO APROVADOS</h3>
        <table>
            <thead>
                <tr style="background: #ef4444;">
                    <th>Placa</th>
                    <th>Nº da OS</th>
                    <th>Data de Entrada na Oficina</th>
                    <th>Descrição</th>
                    <th>Valor</th>
                </tr>
            </thead>
            <tbody>
`;
    if (servicosNaoAprovados.length > 0) {
        servicosNaoAprovados.forEach((servico) => {
            html += `
                <tr>
                    <td><strong>${escapeHtml(servico.viatura || '-')}</strong></td>
                    <td>${escapeHtml(servico.ordemServico || '-')}</td>
                    <td>${formatarDataRelatorio(servico.dataEntrada)}</td>
                    <td>${escapeHtml(servico.descricao || '-')}</td>
                    <td>${escapeHtml(servico.valor || 'R$ 0,00')}</td>
                </tr>
            `;
        });
    } else {
        html += `
                <tr>
                    <td colspan="5" class="no-data">Nenhum serviço não aprovado encontrado</td>
                </tr>
        `;
    }
    html += `
            </tbody>
        </table>
    </div>
`;

    // Rodapé
    html += `
    <div class="footer">
        Gerado em ${new Date().toLocaleString('pt-BR')}
    </div>
</body>
</html>
`;

    return html;
}

// Função principal
async function gerarPDF() {
    try {
        console.log('📖 Lendo arquivo de backup...');
        const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
        
        console.log('📝 Gerando HTML do relatório...');
        const html = gerarHTMLRelatorio(backupData.dados || backupData);
        
        console.log('🌐 Iniciando navegador...');
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        
        console.log('📄 Carregando conteúdo HTML...');
        await page.setContent(html, { waitUntil: 'networkidle0' });
        
        console.log('💾 Gerando PDF...');
        await page.pdf({
            path: outputPath,
            format: 'A4',
            margin: {
                top: '2cm',
                right: '2cm',
                bottom: '2cm',
                left: '2cm'
            },
            printBackground: true
        });
        
        await browser.close();
        
        console.log('\n✅ PDF gerado com sucesso!');
        console.log('📁 Arquivo salvo em:', outputPath);
        
    } catch (error) {
        console.error('❌ Erro ao gerar PDF:', error.message);
        if (error.code === 'ENOENT') {
            console.error('Arquivo de backup não encontrado:', backupPath);
        }
        process.exit(1);
    }
}

// Executar
if (require.main === module) {
    gerarPDF();
}

module.exports = { gerarHTMLRelatorio, gerarPDF };
