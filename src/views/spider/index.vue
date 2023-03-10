<template>
  <div class="app-container">

    <el-form :model="queryParams" ref="queryParams" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="任务名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入任务名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="爬虫名" prop="spider">
        <el-input
          v-model="queryParams.spider"
          placeholder="请输入任务爬虫名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="sign">
        <el-input
          v-model="queryParams.sign"
          placeholder="请选择任务状态"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建日期" prop="createTime">
        <el-date-picker clearable
          v-model="queryParams.createTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择任务创建日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="spiderList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" width="40" >
        <template #default="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="任务名" align="center" prop="name" width="150" />
      <el-table-column label="爬虫名" align="center" prop="spider" width="150" />
      <el-table-column label="状态" align="center" prop="state.sign" width="100" />
      <el-table-column label="创建日期" align="center" prop="state.createTime" width="100" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body :before-close="cancel">
      <el-form ref="settingForm" :model="settingForm" :rules="rules" label-width="80px">
        <el-form-item label="配置">
          <el-input v-model="settingForm" placeholder="请填写配置文本" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="pop_title" :visible.sync="pop_open" width="30%" :before-close="cancel">
      <span v-html="pop_title"></span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="cancel">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { listSpider, addSpider, getSpider, updateSpider, delSpider } from "@/api/spider";
import { resetForm } from "@/utils/ruoyi";

export default {
  name: "Spider",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 应用列表表格数据
      spiderList: [],
      // 弹出层标题
      title: "",
      pop_title: "",
      // 是否显示弹出层
      open: false,
      pop_open: false,
      //判断是添加还是修改,并传输选中id
      open_id: null,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        spiderd: null,
        sign: null,
        createTime: null
      },
      // 表单参数
      settingForm: '',
      // 表单校验
      rules: {}
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询应用列表列表 */
    getList() {
      this.loading = true;
      listSpider(this.queryParams).then(response => {
        this.spiderList = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.pop_open = false;
      this.title = ""
      this.pop_title = ""
      this.reset();
    },
    // 表单重置
    reset() {
      this.open_id = null
      this.settingForm = ''
      resetForm(this, "settingform");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      resetForm(this, "queryParams");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      console.log(selection)
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加应用列表";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = !isNaN(row.id) ? row.id : this.ids[0]
      getSpider(id).then(response => {
        delete response.data["state"]
        this.settingForm = JSON.stringify(response.data);
        this.open = true;
        this.title = "修改爬虫配置";
        this.open_id = id
      });
    },
    /** 提交按钮 */
    submitForm() {
      if (this.open_id != null) {
        updateSpider(this.open_id, this.settingForm).then(response => {
          this.open = false;
          this.pop_title = "修改成功"
          this.pop_open = true
          this.getList();
        });
      } else {
        addSpider(this.settingForm).then(response => {
          this.open = false;
          this.pop_title = "新增成功"
          this.pop_open = true
          this.getList();
        });
      }
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = !isNaN(row.id) ? [row.id] : this.ids
      delSpider(ids)
      this.pop_title = "删除成功"
      this.pop_open = true
      this.getList();
    },
  }
};

</script>
