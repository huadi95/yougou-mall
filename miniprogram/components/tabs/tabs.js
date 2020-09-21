// components/tabs/tabs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabs: {
      type: Array,
      value: []
  }
  },
  methods: {
    handleItemChange(e) {
      //1.获取标题的索引
      let {
          index
      } = e.currentTarget.dataset;
      //2.将获取的索引值传给父组件
      this.triggerEvent('tabsItemChange', {
          index
      });
  }
  }
})
