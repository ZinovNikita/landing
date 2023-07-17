<template>
  <a-steps
    :current="step"
    size="small"
    :items="[
      {title: 'Выбрать шаблон'},
      {title: 'Заполнить поля'},
      {title: 'Сохранить файл'}
    ]"
  ></a-steps>
  <a-form @finish="onFinish" :label-col="{ span: 5 }" :wrapper-col="{ span: 13 }">
    <a-form-item :wrapper-col="{ span: 13, offset: 5 }">
      <a-upload accept="text/xml,application/xml" :file-list="fileList" :multiple="true" :max-count="1" :before-upload="beforeUpload" @remove="onClear">
        <a-button>Выбрать шаблон</a-button>
      </a-upload>
    </a-form-item>
    <template v-if="fields && fields.length > 0">
      <a-form-item label="Имя файла">
        <a-input v-model:value="fileName"/>
      </a-form-item>
      <a-form-item v-for="f of fields" :label="f.label" :name="f.name">
        <a-input v-if="f.type==='input'" v-model:value="f.value"/>
        <a-date-picker v-if="f.type==='date'" v-model:value="f.value" valueFormat="DD.MM.YYYY" format="DD.MM.YYYY" :locale="locale" :style="{ width: '100%' }"/>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 13, offset: 5 }">
        <a-button type="primary" @click="onFinish">Распечатать</a-button>
        <a-button style="margin-left: 10px" @click="onClear">Очистить</a-button>
      </a-form-item>
    </template>
  </a-form>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { Upload } from 'ant-design-vue';
import type { UploadProps } from 'ant-design-vue';
import locale from 'ant-design-vue/es/date-picker/locale/ru_RU';
type Field = {
  template: string
  name: string
  type: string
  label: string
  value: string
}
const fields = ref<Field[]>([]);
const fileName = ref('');
const step = ref(0);
const fileList =  ref<UploadProps['fileList']>([]);
let fileContent = '';
const beforeUpload: UploadProps['beforeUpload'] = file => {
  if(file.type !== 'text/xml') return Upload.LIST_IGNORE;
  fileList.value?.push(file)
  new Promise(resolve => {
    const reader = new FileReader();
    reader.readAsText(file)
    reader.onload = () => {
      fileContent = reader.result as string || ''
      const m = fileContent.match(/(\$\{)([^\}]*)(\})/gi)
      if(m !== null && m.length > 0){
        m.forEach((s:string)=>{
          const a: string[] = s.substring(2,s.length-1).split(':')
          if(a.length === 3 && !fields.value.find(f => f.name === a[0])) {
            fields.value.push({
              template: s,
              name: a[0],
              type: a[1],
              label: a[2],
              value: ''
            })
          }
        })
      }
      step.value = 1
      resolve(true)
    }
  });
  return false;
}
const onClear = () => {
  fileContent = ''
  step.value = 0
  fields.value = []
  fileList.value = []
}
const onFinish = () => {
  let str = fileContent
  for(let f of fields.value)
    str = str.replace(f.template,f.value)
  const a = document.createElement('a')
  a.setAttribute('download', `${fileName.value}.xml`)
  a.setAttribute('href', URL.createObjectURL(new Blob([str], {type: 'text/xml'})))
  a.click()
  step.value = 2
}
</script>
