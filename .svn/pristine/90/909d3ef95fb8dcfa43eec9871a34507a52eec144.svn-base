<template>
    <div>
        <h1>検索結果画面</h1>

        <b-table striped hover :items="items">
             <template #cell(update)="row">
            <b-button size="sm"  variant="secondary" @click="info(row.item, row.index, $event.target)">修正/削除</b-button>
             </template>
        </b-table>

        <b-button to="/" variant="secondary" class="mr-1">戻る</b-button>
        <b-button to="/register" variant="secondary" class="mr-1">新規</b-button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            //fields: ['ログインユーザ', '氏名', 'EMAIL', '開始日', '終了日'],
            items: [
                {user: 'miki', name: '三木',    email: '業務１', date_start: '2020-12-25', date_end: '2020-12-25', update: ''},
                {user: 'yasui', name: '安井', email: '業務１', date_start: '2020-12-25', date_end: '2020-12-25'},
                {user: 'komata', name: '駒田', email: '業務１', date_start: '2020-12-25', date_end: '2020-12-25'},
                {user: 'dmitry', name: 'ディミトリ', email: '業務１', date_start: '2020-12-25', date_end: '2020-12-25'}
                
            ],
        infoModal: {
          id: 'info-modal',
          title: '',
          content: ''
        }
        }
    },
    methods: {
        info(item, index, button) {
        this.infoModal.title = `Row index: ${index}`
        this.infoModal.content = JSON.stringify(item, null, 2)
        this.$root.$emit('bv::show::modal', this.infoModal.id, button)
        }
    }
}
</script>