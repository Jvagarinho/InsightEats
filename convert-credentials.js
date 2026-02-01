const fs = require('fs');
const path = require('path');

// Script para converter credenciais.json para Base64
// Use: node convert-credentials.js

const credentialsPath = path.join(__dirname, 'credenciais.json');

if (!fs.existsSync(credentialsPath)) {
  console.error('❌ Erro: Ficheiro credenciais.json não encontrado!');
  console.log('\nCertifique-se de que:');
  console.log('1. O ficheiro credenciais.json está na raiz do projeto');
  console.log('2. O ficheiro contém as credenciais da Service Account do Google Cloud');
  process.exit(1);
}

try {
  const content = fs.readFileSync(credentialsPath, 'utf-8');
  
  // Validar se é JSON válido
  JSON.parse(content);
  
  // Converter para Base64
  const base64 = Buffer.from(content).toString('base64');
  
  console.log('✅ Credenciais convertidas com sucesso!\n');
  console.log('COPIE O SEGUINTE VALOR PARA A VARIÁVEL DE AMBIENTE GOOGLE_CREDENTIALS_BASE64:\n');
  console.log('='.repeat(80));
  console.log(base64);
  console.log('='.repeat(80));
  console.log('\n⚠️  INSTRUÇÕES PARA VERCEL:');
  console.log('1. Vá ao dashboard do Vercel');
  console.log('2. Selecione o projeto InsightEats');
  console.log('3. Vá a Settings → Environment Variables');
  console.log('4. Adicione uma nova variável:');
  console.log('   - Name: GOOGLE_CREDENTIALS_BASE64');
  console.log('   - Value: [cole o valor acima]');
  console.log('5. Clique em Save');
  console.log('6. Faça redeploy do projeto\n');
  
  console.log('⚠️  IMPORTANTE: Nunca partilhe/commit este ficheiro!');
  console.log('   O ficheiro credenciais.json está no .gitignore\n');
  
} catch (error) {
  console.error('❌ Erro ao processar credenciais:', error.message);
  process.exit(1);
}
