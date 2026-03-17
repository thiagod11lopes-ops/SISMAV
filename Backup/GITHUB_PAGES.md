# Publicar o SISMAV no GitHub Pages (link para abrir em qualquer dispositivo)

Com o GitHub Pages você obtém um link público (ex.: **https://thiagod11lopes-ops.github.io/SISMAV/**) para abrir o SISMAV de qualquer computador ou celular. Os dados ficam no **navegador** (IndexedDB) e o **backup** é enviado ao **Firebase (Firestore)**.

## Passo 1: Ativar o GitHub Pages no repositório

1. No **GitHub**, abra o repositório **SISMAV**: https://github.com/thiagod11lopes-ops/SISMAV  
2. Clique em **Settings** (Configurações).  
3. No menu à esquerda, em **"Code and automation"**, clique em **Pages**.  
4. Em **"Build and deployment"** > **Source**, escolha **Deploy from a branch**.  
5. Em **Branch**, selecione **main** e a pasta **/ (root)**.  
6. Clique em **Save**.  
7. Aguarde alguns minutos. O link do site aparecerá em algo como:  
   **https://thiagod11lopes-ops.github.io/SISMAV/**

## Passo 2: Autorizar o domínio no Firebase

Para o Firebase/Firestore funcionar quando o SISMAV for aberto pelo link do GitHub:

1. Acesse o **Firebase Console**: https://console.firebase.google.com/  
2. Selecione o projeto **SISMAV** (sismav-c5577).  
3. Clique na **engrenagem** → **Configurações do projeto**.  
4. Role até **"Domínios autorizados"** (Authorized domains).  
5. Clique em **Adicionar domínio** e adicione:  
   **`thiagod11lopes-ops.github.io`**  
6. Salve.

## Passo 3: Enviar as alterações para o GitHub

No Cursor (ou no terminal), faça **Commit** e **Sync** (ou Push) para enviar o projeto (incluindo o `index.html`) para o repositório. Depois que o GitHub Pages terminar de publicar, o link estará no ar.

## Usar o link

- **Link principal:** https://thiagod11lopes-ops.github.io/SISMAV/  
  (abre o `index.html`, que redireciona para o SISMAV)

- **Link direto da aplicação:** https://thiagod11lopes-ops.github.io/SISMAV/SISMAV.html  

Em qualquer dispositivo (PC, celular, tablet), basta abrir esse link no navegador. Os dados são salvos no próprio dispositivo e o backup automático é enviado ao Firestore.

**Observação:** O backend Node (localhost:3000) **não** roda no GitHub Pages. O sistema funciona apenas com os arquivos estáticos + IndexedDB + Firestore, que já estão configurados.
