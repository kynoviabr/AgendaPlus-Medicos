# Aura — Roadmap SaaS Profissional

## Decisão de arquitetura

O Aura é uma plataforma SaaS multi-clínica. A IA interpreta intenções e conduz conversas, mas não é fonte de verdade nem executa operações diretamente.

```text
Paciente / equipe
  -> canais (WhatsApp, web)
  -> camada de conversa e IA
  -> tools tipadas / serviços de domínio
  -> banco transacional com RLS e clinic_id
  -> auditoria, métricas e operações assíncronas
```

Princípios obrigatórios:

- Toda leitura e escrita pertence a uma `clinic_id`.
- O banco e os serviços de domínio validam regras, autorização, disponibilidade e idempotência.
- A IA usa dados por tools; não executa SQL, RPCs ou chamadas de provedor diretamente.
- Integrações externas usam adapters, secrets backend-only e observabilidade.
- Processos assíncronos são idempotentes, rastreáveis e recuperáveis.

## Fase 0 — Baseline e governança

Objetivo: tornar o estado atual reproduzível e auditável.

1. Manter `main` como única linha de integração e usar branches curtas por entrega.
2. Exigir lint, testes, build e smoke staging antes de merge/deploy.
3. Manter desenvolvimento, staging e produção em projetos Supabase separados.
4. Registrar decisões técnicas relevantes como ADRs curtos em `docs/adr/`.
5. Manter secrets somente no gerenciador do Supabase/Vercel; nunca em código, commits ou logs.

Critério de aceite: pipeline verde, staging identificável, migrations sincronizadas e rollback documentado.

## Fase 1 — Mensageria confiável por clínica

Objetivo: transformar WhatsApp e lembretes em uma capacidade empresarial, sem credenciais globais.

1. Refatorar o dispatcher de lembretes para buscar e descriptografar a conexão Meta da própria clínica em `whatsapp_connections`.
2. Remover dependência de `WHATSAPP_ACCESS_TOKEN` e `WHATSAPP_PHONE_NUMBER_ID` globais no dispatcher.
3. Modelar mensagens de lembrete por template Meta aprovado, idioma e parâmetros versionados.
4. Registrar tentativa, ID do provedor, entrega, leitura, falha e motivo sanitizado.
5. Implementar outbox/fila com claim atômico, idempotência, retry exponencial e dead-letter para falhas finais.
6. Unificar o legado de comandos de agenda com o mesmo adapter Meta/HMAC, removendo caminhos paralelos quando homologados.

Critério de aceite: um lembrete é enviado pela conexão da clínica correta, nunca duplica, tem status rastreável e pode ser reprocessado com segurança.

## Fase 2 — Meta WhatsApp em staging

Objetivo: homologar tráfego real usando número e dados exclusivamente de teste.

1. Criar/configurar o App Meta, WABA, número de teste e System User.
2. Configurar webhook único do Aura e assinar eventos de mensagens e status.
3. Configurar secrets de staging: App/Config ID, App Secret, token de verificação, chave de criptografia e versão Graph API.
4. Conectar uma única clínica por Embedded Signup.
5. Validar inbound, HMAC, roteamento por `phone_number_id`, idempotência e persistência.
6. Validar outbound humano e lembrete por template, incluindo delivery/read receipts.

Critério de aceite: mensagens entram e saem apenas da clínica correta, eventos de entrega são persistidos e erros são observáveis.

## Fase 3 — IA em piloto controlado

Objetivo: ativar a IA gradualmente, sem risco operacional.

1. Configurar a chave de desenvolvimento OpenAI no staging e limites de custo/uso.
2. Rodar `npm run eval:ai:fast` e `npm run eval:ai` com dataset sintético.
3. Ativar uma clínica em modo `shadow`: a IA processa, mas não envia resposta.
4. Revisar qualidade, grounding, handoff, privacidade, latência e erros.
5. Ativar `active` apenas para a clínica piloto, com kill switch global e por clínica.
6. Manter agenda e mutations atrás de gates explícitos; começar por leitura antes de criar/remarcar/cancelar.

Critério de aceite: respostas fundamentadas nos dados da clínica, nenhuma mutation indevida, handoff humano auditável e rollback imediato.

## Fase 4 — Operação e observabilidade

Objetivo: detectar e recuperar falhas antes de afetarem a clínica.

1. Painel operacional por clínica: inbound, outbound, falhas, latência, fila, handoffs e lembretes pendentes.
2. Alertas para falhas de webhook, token expirado, dead letters, erro Meta/OpenAI e backlog de fila.
3. Correlation ID entre webhook, conversa, tool, mutation e envio externo.
4. Logs sanitizados: sem conteúdo de conversa, tokens ou dados pessoais desnecessários.
5. Runbooks para incidente Meta, incidente OpenAI, erro de agenda e rollback da IA.

Critério de aceite: cada falha crítica é detectável, investigável e possui procedimento de recuperação.

## Fase 5 — Produção e continuidade

Objetivo: preparar o primeiro piloto real e a continuidade do serviço.

1. Provisionar Supabase e Vercel de produção separados do staging.
2. Configurar backup/PITR e executar restore em ambiente isolado.
3. Definir gestão de acessos, rotação de secrets e revisão periódica de permissões.
4. Implantar checklist de go-live por clínica: dados, equipe, WhatsApp, templates, consentimento e treinamento.
5. Publicar por rollout: uma clínica piloto, critérios de sucesso, janela de suporte e aprovação humana antes de expansão.

Critério de aceite: backup restaurado com sucesso, rollback testado e piloto aprovado por checklist operacional.

## Fase 6 — Escala SaaS

Objetivo: operar dezenas e depois centenas de clínicas sem perda de isolamento ou previsibilidade.

1. Criar contexto ativo e seletor de clínica para usuários vinculados a mais de uma clínica.
2. Adicionar quotas por tenant para mensagens, IA, automações e armazenamento.
3. Criar onboarding automatizado: clínica, grupos, unidades, templates e checklist inicial.
4. Introduzir billing/medição por uso somente após métricas operacionais estáveis.
5. Evoluir a fila para workers duráveis conforme volume e SLA exigirem.

Critério de aceite: uma segunda clínica pode ser criada, configurada e operada sem afetar a primeira.

## Backlog de produto — calendário nacional de feriados

Objetivo: reduzir o trabalho manual de configuração da agenda e evitar marcações em dias sem atendimento.

1. Incluir, em cada unidade, a ação **"Adicionar feriados nacionais"**, com seleção do ano e prévia antes da confirmação.
2. Criar automaticamente exceções de agenda fechadas para os feriados nacionais oficiais do Brasil, preservando o fuso horário da unidade.
3. Garantir idempotência: executar novamente para o mesmo ano não cria duplicidades.
4. Exibir conflitos com exceções já cadastradas manualmente e nunca sobrescrevê-las sem decisão explícita do administrador.
5. Registrar origem, ano e data de importação para auditoria e permitir remover apenas os itens importados.
6. Manter feriados estaduais, municipais e dias facultativos como uma etapa posterior, vinculada à localização da unidade.

Critério de aceite: um administrador configura o calendário nacional de uma unidade em poucos cliques, revisa conflitos antes de salvar e continua podendo definir exceções locais.

## Sequência desta semana

1. Fase 1: refactor do dispatcher de lembretes por clínica.
2. Fase 2: App Meta, número de teste, webhook e uma clínica de homologação.
3. Fase 3: OpenAI em staging, modo `shadow` e avaliação.
4. Fase 4: telemetria mínima e runbook de rollback.
5. Demo controlada: inbound, resposta IA, handoff, lembrete e status de entrega.

## Dependências que exigem decisão/ação humana

- Acesso ao Meta Business Manager, WABA, número de teste e aprovação de templates.
- Chave/projeto OpenAI com orçamento e política de uso definidos.
- Aprovação explícita antes de ativar IA ou mensagens para pacientes reais.
- Definição de retenção de dados, consentimento e responsável operacional por clínica.
