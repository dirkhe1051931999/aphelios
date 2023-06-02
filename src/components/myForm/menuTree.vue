<template>
  <div>
    <p class="f-bold fs-12 p-b-8 row items-center">
      <span class="m-r-6">{{ rules.length ? '*' : '' }} {{ label }}</span>
      <slot name="subTitle"></slot>
    </p>
    <q-input
      v-model.trim="model"
      :type="type"
      :class="['m-b-5', classes]"
      :placeholder="inputPlaceholder"
      :rules="rules"
      :hint="hint"
      readonly
      ref="inputDom"
      autocapitalize="off"
      autocomplete="new-password"
      autocorrect="off"
      clearable
      no-error-icon
      dense
      outlined
      clear-icon="app:clear"
      :spellcheck="false"
    >
      <template #append>
        <q-icon name="o_mouse" size="26px" color="grey" class="cursor-pointer">
          <q-menu>
            <q-list dense style="min-width: 100px">
              <q-item clickable v-for="level1 in firstLevelSelectOption" :key="level1.code">
                <q-item-section @click="clickName(level1, 1, 2)">{{ level1.name }}</q-item-section>
                <q-item-section side v-if="level1.children">
                  <q-icon name="keyboard_arrow_right" />
                </q-item-section>
                <q-menu anchor="top left" self="center right">
                  <q-list>
                    <q-item v-for="level2 in level1.children" :key="level2.code" dense clickable>
                      <q-item-section>{{ level2.name }}</q-item-section>
                      <q-item-section side v-if="level2.children">
                        <q-icon name="keyboard_arrow_right" />
                      </q-item-section>
                      <q-menu :auto-close="level2.children && level2.children[0] && !level2.children[0].children" anchor="top left" self="center right">
                        <q-list>
                          <q-item v-for="level3 in level2.children" :key="level3.code" dense clickable @click="splicing(level1, level2, level3)">
                            <q-item-section>{{ level3.name }}</q-item-section>
                            <q-item-section side v-if="level3.children">
                              <q-icon name="keyboard_arrow_right" />
                            </q-item-section>
                            <q-menu :auto-close="level3.children && level3.children[0] && !level3.children[0].children" anchor="top left" self="center right" v-if="level3.children">
                              <q-list>
                                <q-item v-for="level4 in level3.children" :key="level4.code" dense clickable @click="splicing(level1, level2, level3, level4)">
                                  <q-item-section>{{ level4.name }}</q-item-section>
                                </q-item>
                              </q-list>
                            </q-menu>
                          </q-item>
                        </q-list>
                      </q-menu>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-item>
            </q-list>
          </q-menu>
        </q-icon>
      </template>
    </q-input>
    <q-input
      v-model.trim="detail_model"
      type="textarea"
      class="q-mb-md"
      placeholder="Please enter extra information"
      :rules="rules"
      autocapitalize="off"
      autocomplete="new-password"
      autocorrect="off"
      clearable
      no-error-icon
      dense
      outlined
      clear-icon="app:clear"
      :spellcheck="false"
    >
    </q-input>
  </div>
</template>

<script lang="ts">
import { getCurrentInstance } from 'vue';
import { Component, Prop, Vue, Watch } from 'vue-facing-decorator';

@Component({ name: 'MyMenuTreeComponent', emits: ['init', 'change', 'splicing', 'detail_input', 'input'] })
export default class MyMenuTreeComponent extends Vue {
  declare $refs: any;
  @Prop({ default: {} }) option!: {
    model: string;
    detail_model: string;
    type?: string;
    inputPlaceholder?: string;
    classes?: string;
    rules: any[];
    label: string;
    hint: string;
    readonly: boolean;
    disable: boolean;
  };
  @Watch('option.disable', { deep: true })
  onDisablechange(newVal: boolean) {
    this.disable = newVal;
  }
  @Watch('option.model', { deep: true })
  onModelchange(newVal: string) {
    this.model = newVal;
  }
  @Watch('option.detail_model', { deep: true })
  onOptionDetailModelchange(newVal: string) {
    this.detail_model = newVal;
  }
  @Watch('model')
  onchange(newVal: string) {
    this.$emit('input', newVal);
  }
  @Watch('detail_model')
  onDetailModelchange(newVal: string) {
    console.log('detail_model', newVal);
    this.$emit('detail_input', newVal);
  }
  @Watch('option.classes')
  onClassesChange(newVal: string) {
    this.classes = newVal;
  }
  @Watch('option.rules', { deep: true })
  onRulesChange(newVal: any[]) {
    this.rules = newVal;
  }
  @Watch('option.label', { deep: true })
  onLabelChange(newVal: string) {
    this.label = newVal;
  }
  mounted() {
    this.model = this.option.model ?? '';
    this.type = this.option?.type ?? 'text';
    this.inputPlaceholder = this.option?.inputPlaceholder ?? this.globals.$t('messages.pleaseSelect');
    this.classes = this.option?.classes ?? '';
    this.rules = this.option?.rules;
    this.label = this.option?.label;
    this.hint = this.option.hint;
    this.readonly = this.option.readonly;
    this.disable = this.option.disable || false;
    this.$emit('init', this);
  }
  public globals = getCurrentInstance()!.appContext.config.globalProperties;
  public model = '';
  public detail_model = '';
  public type = '';
  public inputPlaceholder = '';
  public classes = '';
  public rules: any[] = [];
  public label = '';
  public hint: string = '';
  public readonly: boolean = false;
  public disable: boolean = false;
  public firstLevelSelectOption = [];
  /* event */
  public clickName(item: any, currentLevel: number, nextLevel: number) {
    this.$emit('change', { row: item, currentLevel, nextLevel, ctx: this });
  }
  public async validForm() {
    return await this.$refs['inputDom'].validate();
  }
  public splicing(level1: any, level2: any, level3: any, level4?: any) {
    this.$emit('splicing', {
      level1,
      level2,
      level3,
      level4: level4 || null,
      ctx: this,
    });
  }
}
</script>

<style lang="scss" scoped></style>
