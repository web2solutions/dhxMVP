(function(namespace) {
    'use strict';
})(window.$dhx = window.$dhx || {});
(function(namespace) {
    'use strict';
})($dhx.ui = $dhx.ui || {});
$dhx.ui.i18n['pt-br'] = {
    text_labels: {
        // validation text labels section
        validation_notEmpty: function(label) {
            return "O campo '" + label + "' deve ser preenchido";
        },
        validation_Empty: function(label) {
            return "O campo '" + label + "' não deve ser preenchido";
        },
        validation_ValidEmail: function(label) {
            return "O valor do campo " + label + " não é um e-mail válido";
        },
        validation_ValidInteger: function(label) {
            return "O valor do campo " + label + " deve ser do tipo inteiro";
        },
        validation_ValidFloat: function(label) {
            return "O valor do campo " + label + " deve ser do tipo float";
        },
        validation_ValidNumeric: function(label) {
            return "O valor do campo " + label + " deve ser numérico";
        },
        validation_ValidAplhaNumeric: function(label) {
            return "O valor do campo " + label + " deve ser alpha numérico";
        },
        validation_ValidDatetime: function(label) {
            return "O valor do campo " + label + " deve ser uma data válida com horário";
        },
        validation_ValidExpirationdate: function(label) {
            return "O valor do campo " + label + " deve ser uma data de expiração válida";
        },
        validation_ValidDate: function(label) {
            return "O valor do campo " + label + " deve ser uma data válida";
        },
        validation_ValidTime: function(label) {
            return "O valor do campo " + label + " deve ser um horário";
        },
        validation_ValidCurrency: function(label) {
            return "O valor do campo " + label + " deve ser um valor monetário";
        },
        validation_ValidSSN: function(label) {
            return "O valor do campo " + label + " deve ser um número de social security";
        }
    },
    // menu
    File: 'Arquivo'.CFC(),
    New: 'Novo'.CFC(),
    OpenSelected: 'Abrir selecionado'.CFC(),
    PDFVersion: 'Versão em PDF'.CFC(),
    Edit: 'Editar'.CFC(),
    UpdateSelect: 'Alterar selecionado'.CFC(),
    Deleteselected: 'Deletar selecionado'.CFC(),
    Settings: 'Configurações'.CFC(),
    SetUpGridColumns: 'Configurar colunas da grid'.CFC(),
    Formsettings: 'Configurações de formulário'.CFC(),
    Gridsettings: 'Configurações da grid'.CFC(),
    SelectIdiom: 'Selecionar idioma'.CFC(),
    Portuguese: 'Português'.CFC(),
    English: 'English'.CFC(),
    Help: 'Ajuda'.CFC(),
    ReportBug: 'Reportar erros'.CFC(),
    QuickHelp: 'Ajuda rápida'.CFC(),
    AnotherRecords: 'Outros Registros'.CFC(),
    EditNameTable: function(table) {
            return table.CFC() + ' - gerenciamento';
    },
    recordsmanagement: 'gerenciamento de registros',
    Newrecord: 'Novo registro',
    Openrecord: 'Abrir registro',
    FindRecords: 'Procurar registros',
    updateselected: 'alterar selecionado',
    deleteselected: 'deletar selecionado',
    reloaddata: 'recarregar dados',
    quicknavigation: 'navegação rápida',
    gotofirstrecord: 'ir para<br>primeiro registro',
    gotolast: 'ir para o último',
    gotoprevious: 'ir para o anterior',
    gotonext: 'ir para o próximo',
    Filloutthefields: 'Preencha os campos',
    ChangeIdiomAgreement: 'A janela será recarregada para que as novas configurações tenham efeito. <br><br> Isto também irá gerar um cookie em seu navegador.<br><br> Você deseja continuar?',
    ChangeskinAgreement: 'A janela será recarregada para que as novas configurações tenham efeito. <br><br> Isto também irá gerar um cookie em seu navegador.<br><br> Você deseja continuar?',
    continue: 'continuar',
    cancelar: 'cancelar',
    Selectskin: 'Selecionar skin'.CFC(),
    Initializing: 'Inicializando',
    time_remaining_for_token_expiration: 'tempo restante até a sessão expirar',
    no_data_transferred: 'nenhum dado transferido',
    Notauthorizedyet: 'Não autorizado',
    no_errors: 'nenhum erro',
    could_not_sync_grid: 'impossivel sincronizar grid',
    counting_records: 'estimando registros',
    total_records: 'número de registros',
    getting_quota_information: 'solicitando informações de disco',
    used: 'usado',
    remaining: 'restante',
    Quota_information: 'Uso de disco',
    requesting_first_record: 'solicitando primeiro registro',
    requesting_next_record: 'solicitando próximo registro',
    requesting_previous_record: 'solicitando registro anterior',
    requesting_last_record: 'solicitando último registro',
    selected: 'registro selecionado',
    save_record: 'adicionar registro',
    update_record: 'salvar alteração',
    Provide_some_values_to_search: 'Digite algum valor para buscar',
    search: 'buscar',
    clear_results: 'limpar resultados',
    insensitivity_search: 'a busca é insensitiva para case e caracteres especiais',
    About: 'Sobre',
    open: 'abrir',
    close: 'fechar',
    right_click_to_select_a_language: 'clique com botão direito para escolher um idioma',
    closeall: 'fechar todos',
    ControlPanel: 'Painel de Controles',
    minimizeall: 'minimizar todos',
    Click_on_a_wallpaper_to_preview: 'Clique no papel de parede para vizualizar',
    Walpapersettings: 'Configurações de papel de parede',
    Systeminformations: 'Informações do sistema',
    Globalformssettings: 'Configurações de formulário',
    setaswallpaper: 'salvar como papel de parede',
    click_to_open_control_panel: 'clique para abrir o Painel de Controles',
    capitalize_note: "Habilitando esse recurso, todas as vezes em que você digitar em um formulário o texto será automaticamente convertido em maiúsculo. <br><br>Exemplo: se você digitar <strong>Nome</strong>, isso será automaticamenrte convertido para <strong>NOME</strong>.<br><br>Certifique-se de que realmente quer habilitar esse recurso.",
    latinize_note: "Habilitando esse recurso, todas as vezes em que você digitar em um formulário, o texto terá automaticamente todos os seus acentos removidos. <br><br>Exemplo: se você digitar <strong>Años</strong>, isso será automaticamente convertido para <strong>Anos</strong>.<br><br>Certifique-se de que realmente quer habilitar esse recurso.",
    "Capitalize form inputs": "Tornar maiúsculo o texto em campos",
    "Latinize form inputs": "Latinizar o texto em campos",
    "capitalize text while typing": "capitalizar texto enquanto eu digito",
    "latinize text while typing": "latinizar texto enquanto eu digito",
    "Forms global settings": "Configuração global de formulários",
    "quota usage": "uso do disco",
    "Size in GB": "Consumo em GB",
    'Live quota information': 'Informações de uso disco',
    username: 'usuário',
    password: 'senha',
    login: 'entrar',
    forgot_password: 'esqueci minha senha',
    session_expires_in: 'tempo para o término da sessão',
    click_to_open_messages: 'clique para abrir ver as mensagens',
    expired_token_message: 'Sessão expirada. Por favor efetue login novamente.',
    really_want_to_delete: 'Deseja realmente deletar?',
    could_not_delete: 'erro ao deletar',
    record_deleted: 'registro excluído. ',
    deleting_record: 'excluíndo registro',
    realtime_communication_is_on: 'socket está online',
    realtime_communication_is_off: 'socket está offline',
    there_is_no_active_transfer: 'transferência REST inativa',
    there_is_active_transfer: 'transferência REST ativa'
};
//$dhx.ui.language = $dhx.extend( $dhx.ui.i18n['pt-br'] );