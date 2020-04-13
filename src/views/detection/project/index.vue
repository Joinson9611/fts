<template>
  <div class="app-container">
    <!-- <div class="app-title-item">
      <span class="tip-text title">消防设施及建筑防火</span>
      <span class="tip-text" style="color:#909399">-下方可以新建、编辑、删除消防设施及建筑防火项目-</span>
    </div> -->
    <!-- <div class="filter-container">
      <el-button v-waves class="filter-item" style="margin-left: 10px" type="primary" icon="el-icon-plus" @click="openNewProjectDialog">新建项目</el-button>
      <el-button v-waves :disabled="multipleSelection.length===0" class="filter-item" type="danger" icon="el-icon-delete" @click="deleteProjects">删除项目</el-button>
    </div> -->
    <!--项目列表-->
    <el-card shadow="never" class="project-list" body-style="padding: 0;">
      <div slot="header" class="clearfix">
        <span style="line-height: 29px">项目列表</span>
        <div class="button" style="float: right">
          <!--新建-->
          <el-button v-waves class="filter-item" style="margin-left: 10px" size="small" type="primary" icon="el-icon-plus" @click="openNewProjectDialog">新建项目</el-button>
          <!--删除-->
          <el-button v-waves :disabled="multipleSelection.length===0" size="small" class="filter-item" type="danger" icon="el-icon-delete" @click="deleteProjects">删除项目</el-button>
        </div>
      </div>
      <el-table
        v-loading="isProjectListLoadingShow"
        :data="ProjectList"
        element-loading-text="Loading"
        style="width: 100%;"
        border
        fit
        highlight-current-row
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          align="center"
          width="50"
        />
        <el-table-column label="序号" align="center" width="70">
          <template slot-scope="scope"><span>{{ ( scope.$index+(paramsGetProjects.page - 1) * paramsGetProjects.limit + 1) | page }} </span></template>
        </el-table-column>
        <el-table-column label="项目名称" align="center">
          <template slot-scope="scope">
            <a style="color: #409EFF" @click="openEditProject(scope.row.project_id)"><i>{{ scope.row.name }}</i></a>
          </template>
        </el-table-column>
        <el-table-column label="项目描述" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.label }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" width="120">
          <template slot-scope="scope">
            <i v-show="scope.row.create_time" class="el-icon-time" />
            <span>{{ scope.row.create_time ? getTime(scope.row.create_time) : '/' }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="负责人" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.leader | leader }}</span>
        </template>
      </el-table-column> -->
        <!-- <el-table-column label="检测时段" align="center" width="210">
        <template slot-scope="scope">
          <span>{{ `${getTime(scope.row.testing_time)}~${ getTime(scope.row.testing_completion_time)}` }}</span>
        </template>
      </el-table-column> -->
        <!-- <el-table-column label="是否完成" align="center" width="80">
          <template slot-scope="scope">
            <span :style="{color:scope.row.is_finished? '#67C23A':'#F56C6C'}">{{ isFinished[scope.row.is_finished] }}</span>
          </template>
        </el-table-column> -->
        <el-table-column
          align="center"
          label="操作"
          width="200"
          fixed="right"
        >
          <template slot-scope="scope" class="tab-btn">
            <el-button
              class="btn"
              type="primary"
              size="mini"
              plain
              @click="checkReport(scope.row)"
            >
              查看报告
            </el-button>
            <el-button
              class="btn"
              type="primary"
              size="mini"
              @click="enterProject(scope.row.project_id)"
            >
              进入项目
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--页码导航-->
      <pagination v-show="total>0" :total.sync="total" :page.sync="paramsGetProjects.page" :limit.sync="paramsGetProjects.limit" @pagination="getProjectFire" />
    </el-card>
    <!-- 新建检测项目的窗口 -->
    <el-drawer
      ref="drawer"
      :title="isEdit?'项目编辑': '新建项目'"
      :visible.sync="isNewDialogShow"
      direction="ltr"
      size="100%"
      @closed="closeDialog"
    >
      <template slot="title">
        <div class="content">
          {{ isEdit ? '新建项目' : '编辑项目' }}
        </div>
        <div class="button" style="text-align:right;margin-right:15px">
          <el-button type="success" plain @click="exportTemp">导出项目信息</el-button>
          <el-button type="success" plain @click="dialogImportVisible = true">导入项目信息</el-button>
        </div>
      </template>
      <div class="project">
        <el-form ref="newProjectRuleForm" :model="paramsNewProjects" :rules="projectTules">
          <div class="title">项目信息</div>
          <div class="projectInfo">
            <el-row>
              <el-col :span="12">
                <el-form-item label="项目名称：" class="dialog-form-item" prop="name" :size="size">
                  <el-input v-model="paramsNewProjects.name" class="dialog-form-item" type="text" />
                </el-form-item>
                <el-form-item label="项目描述：" class="dialog-form-item" prop="label" :size="size">
                  <el-input v-model="paramsNewProjects.label" class="dialog-form-item" type="text" />
                </el-form-item>
                <el-form-item label="委托单位：" class="dialog-form-item" prop="constructing_unit" :size="size">
                  <el-input v-model="paramsNewProjects.constructing_unit" class="dialog-form-item" type="text" />
                </el-form-item>
                <el-form-item label="施工单位：" class="dialog-form-item" prop="construction_unit" :size="size">
                  <el-input v-model="paramsNewProjects.construction_unit" class="dialog-form-item" type="text" />
                </el-form-item>
                <el-form-item label="设计单位：" class="dialog-form-item" prop="designed_unit" :size="size">
                  <el-input v-model="paramsNewProjects.designed_unit" class="dialog-form-item" type="text" />
                </el-form-item>
                <el-form-item label="竣工日期：" class="dialog-form-item" prop="asbuild_time" :size="size">
                  <el-date-picker
                    v-model="paramsNewProjects.asbuild_time"
                    placeholder="请选择竣工日期"
                    style="width: 100%;"
                    value-format="yyyy-MM-dd"
                  />
                </el-form-item>
                <el-form-item label="竣工图纸提供情况：" class="dialog-form-item" prop="asbuild_drawings" :size="size">
                  <el-input v-model="paramsNewProjects.asbuild_drawings" show-word-limit maxlength="25" class="dialog-form-item" type="text" />
                </el-form-item>
                <el-form-item label="占地面积：" class="dialog-form-item" prop="cover_area" :size="size">
                  <el-input v-model="paramsNewProjects.cover_area" class="dialog-form-item" oninput="value=value.replace(/[^\d.]/g,'')" type="text" />
                </el-form-item>
                <el-form-item label="统一社会信用代码：" class="dialog-form-item" prop="constructing_unit_code" :size="size">
                  <el-input v-model="paramsNewProjects.constructing_unit_code" class="dialog-form-item" type="text" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <amap :position="pos" @getPos="getPos" />
                <el-form-item label="建筑类型：" class="dialog-form-item" prop="building_type" :size="size">
                  <el-input v-model="paramsNewProjects.building_type" class="dialog-form-item" type="text" />
                </el-form-item>
                <el-form-item label="建筑总面积(平方米)：" class="dialog-form-item" prop="total_building_area" :size="size">
                  <el-input v-model="paramsNewProjects.total_building_area" oninput="value=value.replace(/[^\d.]/g,'')" class="dialog-form-item" type="text" />
                </el-form-item>
                <el-form-item label="建筑楼层：" class="dialog-form-item" prop="building_floors" :size="size">
                  <el-input v-model="paramsNewProjects.building_floors" class="dialog-form-item" type="text" oninput="value=value.replace(/[^\d.]/g,'')" />
                </el-form-item>
                <el-form-item label="建筑高度(米)：" class="dialog-form-item" prop="building_height" :size="size">
                  <el-input v-model="paramsNewProjects.building_height" class="dialog-form-item" oninput="value=value.replace(/[^\d.]/g,'')" type="text" />
                </el-form-item>
                <el-form-item label="联系人：" class="dialog-form-item" prop="contacts" :size="size">
                  <el-input v-model="paramsNewProjects.contacts" class="dialog-form-item" type="text" />
                </el-form-item>
                <el-form-item label="联系电话：" class="dialog-form-item" prop="contact_number" :size="size">
                  <el-input v-model="paramsNewProjects.contact_number" oninput="value=value.replace(/[^\d.]/g,'')" class="dialog-form-item" type="text" />
                </el-form-item>
                <el-form-item label="检测项：" class="dialog-form-item" prop="checkedItems" :size="size">
                  <el-checkbox-group
                    v-model="checkedItems"
                    :min="1"
                  >
                    <el-checkbox v-for="item in projects" :key="item.id" border :label="item.id" :checked="item.checked">{{ item.name }}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <transition name="fade-transform" mode="out-in">
            <div v-if="paramsNewProjects.is_testing" class="fire">
              <div class="title">消防设施检测信息</div>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="检测方案：" class="dialog-form-item" :size="size">
                    <el-input class="dialog-form-item" disabled :placeholder="schemefileList.length===0?'请选择检测方案':schemefileList[0].name" type="text" style="width:200px" />
                    <el-button v-if="fileTestingScheme.isExport" size="mini" type="primary" @click="exportFile('testing_scheme')">导出文件</el-button>
                    <el-upload
                      ref="sUpload"
                      :show-file-list="false"
                      style="display:inline-block"
                      action="customize"
                      :on-change="handleFileChange"
                      :file-list="schemefileList"
                      :auto-upload="false"
                    >
                      <el-button slot="trigger" size="mini" type="primary">选择文件...</el-button>
                    </el-upload>
                  </el-form-item>
                  <el-form-item label="检测面积(平方米)：" class="dialog-form-item" prop="testing_area" :size="size">
                    <el-input v-model="paramsNewProjects.testing_area" oninput="value=value.replace(/[^\d.]/g,'')" class="dialog-form-item" type="text" />
                  </el-form-item>
                  <el-form-item label="检测时间：" class="dialog-form-item" prop="testing_time" :size="size">
                    <el-date-picker
                      v-model="paramsNewProjects.testing_time"
                      placeholder="请选择检测时间"
                      style="width: 100%;"
                      value-format="yyyy-MM-dd"
                    />
                  </el-form-item>
                  <el-form-item label="检测完成日期：" class="dialog-form-item" prop="testing_completion_time" :size="size">
                    <el-date-picker
                      v-model="paramsNewProjects.testing_completion_time"
                      placeholder="请选择检测完成时间"
                      style="width: 100%;"
                      value-format="yyyy-MM-dd"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="合同扫描件：" class="dialog-form-item" :size="size">
                    <el-input class="dialog-form-item" disabled :placeholder="contractfileList.length===0?'请选择合同扫描件':contractfileList[0].name" type="text" style="width:200px" />
                    <el-button v-if="fileContractCopy.isExport" size="mini" type="primary" @click="exportFile('testing_contract_copy')">导出文件</el-button>
                    <el-upload
                      ref="cUpload"
                      :show-file-list="false"
                      style="display:inline-block"
                      action="customize"
                      :on-change="handleFileContractChange"
                      :file-list="contractfileList"
                      :auto-upload="false"
                      accept=".pdf,.docx,.doc"
                    >
                      <el-button slot="trigger" size="mini" type="primary">选择文件...</el-button>
                    </el-upload>
                  </el-form-item>
                  <el-form-item label="合同金额：" class="dialog-form-item" prop="testing_contract_amount" :size="size">
                    <el-input v-model="paramsNewProjects.testing_contract_amount" class="dialog-form-item" oninput="value=value.replace(/[^\d.]/g,'')" type="text" />
                  </el-form-item>
                  <el-form-item label="检测类型：" class="dialog-form-item" prop="testing_type_id" :size="size">
                    <el-select v-model="paramsNewProjects.testing_type_id" filterable placeholder="请选择检测类型" style="width: 100%">
                      <el-option
                        v-for="item in testingTypeOptions"
                        :key="item.type_id"
                        :label="item.type_name"
                        :value="item.type_id"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="检测范围：" class="dialog-form-item" prop="testing_scope" :size="size">
                    <el-select v-model="paramsNewProjects.testing_scope" filterable placeholder="请选择检测范围" style="width: 100%">
                      <el-option
                        v-for="item in testingScopeOptions"
                        :key="item.type_id"
                        :label="item.type_name"
                        :value="item.type_id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="检测部位：" class="dialog-form-item" prop="testing_part" :size="size">
                    <el-input v-model="paramsNewProjects.testing_part" class="dialog-form-item" type="text" show-word-limit maxlength="45" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="检测批文：" class="dialog-form-item" prop="testing_appvoval" :size="size">
                    <el-input v-model="paramsNewProjects.testing_appvoval" class="dialog-form-item" type="textarea" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="检测部位使用功能：" class="dialog-form-item" prop="testing_part_functiong" :size="size">
                    <el-input v-model="paramsNewProjects.testing_part_functiong" show-word-limit maxlength="45" class="dialog-form-item" type="text" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="检测依据：" class="dialog-form-item" prop="testing_basis" :size="size">
                    <el-input v-model="paramsNewProjects.testing_basis" class="dialog-form-item" type="textarea" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="检测内容(系统)：" class="dialog-form-item" prop="testing_id_list" :size="size">
                    <div class="checkbox">
                      <el-checkbox v-model="checkAll1" :indeterminate="isIndeterminate1" @change="handleCheckAllChange1">全选</el-checkbox>
                      <div style="margin: 15px 0;" />
                      <el-checkbox-group v-model="paramsNewProjects.testing_id_list" @change="handleCheckedChange1">
                        <el-checkbox v-for="item in systemTypeOptions" :key="item.system_type_id" :label="item.system_type_id">{{ item.system_type }}</el-checkbox>
                      </el-checkbox-group>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </transition>
          <transition name="fade-transform" mode="out-in">
            <div v-if="paramsNewProjects.is_testing2" class="building">
              <div class="title">建筑防火检测信息	</div>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="项目类型：" class="dialog-form-item" prop="testing2_type_id" :size="size">
                    <el-select v-model="paramsNewProjects.testing2_type_id" filterable placeholder="请选择项目类型" style="width: 100%">
                      <el-option
                        v-for="item in projectTypeOptions"
                        :key="item.type_id"
                        :label="item.type_name"
                        :value="item.type_id"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="火灾危险性：" class="dialog-form-item" prop="testing2_fire_risk" :size="size">
                    <el-input v-model="paramsNewProjects.testing2_fire_risk" class="dialog-form-item" type="text" />
                  </el-form-item>
                  <el-form-item label="检测时间：" class="dialog-form-item" prop="testing2_time" :size="size">
                    <el-date-picker
                      v-model="paramsNewProjects.testing2_time"
                      placeholder="请选择检测时间"
                      style="width: 100%;"
                      value-format="yyyy-MM-dd"
                    />
                  </el-form-item>
                  <el-form-item label="检测完成日期：" class="dialog-form-item" prop="testing2_completion_time" :size="size">
                    <el-date-picker
                      v-model="paramsNewProjects.testing2_completion_time"
                      placeholder="请选择检测完成时间"
                      style="width: 100%;"
                      value-format="yyyy-MM-dd"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="使用性质：" class="dialog-form-item" prop="testing2_properties" :size="size">
                    <el-input v-model="paramsNewProjects.testing2_properties" class="dialog-form-item" type="text" />
                  </el-form-item>
                  <el-form-item label="合同扫描件：" class="dialog-form-item" :size="size">
                    <el-input class="dialog-form-item" disabled :placeholder="contractfileList2.length===0?'请选择合同扫描件':contractfileList2[0].name" type="text" style="width:200px" />
                    <el-button v-if="fileContractCopy2.isExport" size="mini" type="primary" @click="exportFile('testing2_contract_copy')">导出文件</el-button>
                    <el-upload
                      ref="cUpload"
                      :show-file-list="false"
                      style="display:inline-block"
                      action="customize"
                      :on-change="handleFileContractChange2"
                      :file-list="contractfileList2"
                      :auto-upload="false"
                      accept=".pdf,.docx,.doc"
                    >
                      <el-button slot="trigger" size="mini" type="primary">选择文件...</el-button>
                    </el-upload>
                  </el-form-item>
                  <el-form-item label="合同金额：" class="dialog-form-item" prop="testing2_contract_amount" :size="size">
                    <el-input v-model="paramsNewProjects.testing2_contract_amount" class="dialog-form-item" oninput="value=value.replace(/[^\d.]/g,'')" type="text" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="检测批文(备案号)：" class="dialog-form-item" prop="testing2_appvoval" :size="size">
                    <el-input v-model="paramsNewProjects.testing2_appvoval" class="dialog-form-item" type="textarea" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="检测依据：" class="dialog-form-item" prop="testing2_basis" :size="size">
                    <el-input v-model="paramsNewProjects.testing2_basis" class="dialog-form-item" type="textarea" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="检测内容：" class="dialog-form-item" prop="testing2_id_list" :size="size">
                    <div class="checkbox">
                      <el-checkbox v-model="checkAll2" :indeterminate="isIndeterminate2" @change="handleCheckAllChange2">全选</el-checkbox>
                      <div style="margin: 15px 0;" />
                      <el-checkbox-group v-model="paramsNewProjects.testing2_id_list" @change="handleCheckedChange2">
                        <el-checkbox v-for="item in deviceTypeOptions" :key="item.device_type_id" :label="item.device_type_id">{{ item.device_type }}</el-checkbox>
                      </el-checkbox-group>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </transition>
          <div class="member_info">
            <div class="title">检测人员信息</div>
            <el-form-item label="项目负责人：" class="dialog-form-item" prop="leader" :size="size">
              <el-select v-model="paramsNewProjects.leader" filterable value-key="user_id" placeholder="请选择项目负责人" style="width: 100%">
                <el-option
                  v-for="item in userOptions"
                  :key="item.user_id"
                  :label="item.user_name"
                  :value="item"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="审核人：" class="dialog-form-item" prop="auditor" :size="size">
              <el-select v-model="paramsNewProjects.auditor" filterable value-key="user_id" placeholder="请选择项目负责人" style="width: 100%">
                <el-option
                  v-for="item in userOptions"
                  :key="item.user_id"
                  :label="item.user_name"
                  :value="item"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="检测人员：" class="dialog-form-item" prop="testing_users" :size="size">
              <el-select v-model="paramsNewProjects.testing_users" multiple filterable value-key="user_id" placeholder="请选择检测人员" style="width: 100%">
                <el-option
                  v-for="item in userOptions"
                  :key="item.user_id"
                  :label="item.user_name"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="dialog-footer">
        <el-button @click="isNewDialogShow = false">取消</el-button>
        <el-button type="primary" :loading="isNewLoading" @click="onNewSubmit">确定</el-button>
      </div>
    </el-drawer>
    <!--弹出查看报告窗口-->
    <el-dialog :visible.sync="dialogVisible" :append-to-body="true" :close-on-click-modal="true" :title="'项目名称:' + reportFile.name">
      <el-table
        :data="reportFile.list"
        element-loading-text="Loading"
        style="width: 100%;"
        border
        fit
      >
        <el-table-column label="项目类型" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.project_type }}</span>
          </template>
        </el-table-column>
        <el-table-column label="报告文件名称" align="center">
          <template slot-scope="scope">
            <a style="color: #409EFF" @click="downloadReport">{{ scope.row.is_reported ? scope.row.filename : '/' }}</a>
          </template>
        </el-table-column>
        <el-table-column label="报告生成日期" align="center" width="160">
          <template slot-scope="scope">
            <span>{{ scope.row.report_time }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否完成" align="center" width="78">
          <template slot-scope="scope">
            <span :style="{color:scope.row.is_finished? '#67C23A':'#F56C6C'}">{{ isFinished[scope.row.is_finished] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="完成日期" align="center" width="100">
          <template slot-scope="scope">
            <!-- <i v-show="scope.row.finished_time" class="el-icon-time" /> -->
            <span>{{ scope.row.finished_time ? getTime(scope.row.finished_time) : '/' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="190">
          <template slot-scope="scope">
            <el-button v-waves size="mini" :loading="isGenerateReportLoading" :disabled="!scope.row.is_finished" type="primary" plain @click="generateReport(scope.row)">生成报告</el-button>
            <el-button v-waves style="margin-left:0" size="mini" :disabled="isGenerateReportLoading || !scope.row.is_reported" plain type="success" @click="downloadReport(scope.row)">下载报告</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <div slot="footer" class="dialog-footer" style="margin-right: 20px;margin-top: 0;">
        <el-button v-waves :loading="isGenerateReportLoading" type="primary" plain @click="generateReport">生成报告</el-button>
        <el-button v-waves :disabled="reportFile.list.length===0 || isGenerateReportLoading || !reportFile.is_reported" plain type="success" @click="downloadReport">下载报告</el-button>
      </div> -->
    </el-dialog>

    <!--弹出导入窗口-->
    <el-dialog :visible.sync="dialogImportVisible" :append-to-body="true" :close-on-click-modal="false" style="text-align: center; min-width: 800px">
      <el-upload
        ref="upload"
        :multiple="false"
        :auto-upload="false"
        :on-change="onUploadChange"
        :before-upload="onUploadFileCheck"
        :before-remove="onUploadFileRemove"
        :on-exceed="onUploadFileLimit"
        :http-request="UploadFile"
        :limit="1"
        drag
        accept=".xls,.xlsx"
        action="customize"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div slot="tip" class="el-upload__tip">请上传有效的excel文件</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button v-waves @click.native="onUploadButtonCancel">取消</el-button>
        <el-button
          v-waves
          :loading="isButtonUploadLoadingShow"
          :disabled="isUploadButtonDisable"
          type="primary"
          @click.native="onUploadButtonSubmit"
        >上传
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deleteProjectFire, updateProjectFire, detailProjectFire, addProjectFire, getProjectFire, generateReport, importTemp, exportTemp } from '@/api/project1s'
import { getUsersByCompany } from '@/api/user'
import { getSystemTypes } from '@/api/system'
import { getDeviceTypes } from '@/api/device'
import amap from '@/components/amap'
import { Formattimestamp, Formattimestamp2 } from '@/utils/time'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'

export default {
  name: 'Detectionprojects',
  components: { Pagination, amap },
  directives: { waves },
  filters: {
    leader(leader) {
      return leader ? JSON.parse(leader).user_name : ''
    },
    page(page) {
      // 向上取整
      return Math.ceil(page / 2)
    }
  },
  data() {
    return {
      isUploadButtonDisable: false,
      isButtonUploadLoadingShow: false,
      dialogImportVisible: false,
      checkedItems: [], // 存取被选中的项目
      projects: [{ id: 1, name: '消防设施检测', checked: true }, { id: 2, name: '建筑防火检测', checked: false }],
      isFinished: ['否', '是'],
      mapOpen: false,
      projectTypeOptions: [
        { type_id: 0, type_name: '新家' },
        { type_id: 1, type_name: '扩建' },
        { type_id: 2, type_name: '装修' },
        { type_id: 3, type_name: '建筑保温' },
        { type_id: 4, type_name: '用途变更' }
      ],
      testingTypeOptions: [
        { type_id: 0, type_name: '竣工检测' },
        { type_id: 1, type_name: '年度检测' }
      ],
      testingScopeOptions: [
        { type_id: 0, type_name: '整体检测' },
        { type_id: 1, type_name: '局部检测' }
      ],
      // 报告文件
      reportFile: {
        list: [{
          is_finished: 0,
          is_reported: 0,
          finished_time: '/',
          project_type: '消防检测',
          report_path: '/',
          time: '/',
          filename: '/'
        }, {
          is_finished: 0,
          is_reported: 0,
          finished_time: '/',
          project_type: '建筑防火',
          report_path: '/',
          time: '/',
          filename: '/'
        }],
        project_id: undefined,
        name: '/'
      },
      pos: {
        sname: '', // 地点名称
        slat: 0, // 纬度
        slon: 0 // 经度
      },
      tempEditProject: {
        longitude: undefined,
        latitude: undefined,
        address: undefined
      },
      // 检测方案文件列表
      schemefileList: [],
      // 合同扫描件列表
      contractfileList: [],
      contractfileList2: [],
      isGenerateReportLoading: false,
      isButtonDownLoading: false,
      // 新建项目加载显示
      isNewLoading: false,
      project_id: undefined,
      // 保留检测方案文件信息
      fileTestingScheme: {
        name: '',
        isExport: false,
        url: undefined
      },
      fire_str_list: ['testing_area', 'testing_contract_copy', 'testing_type_id', 'testing_scope', 'testing_part', 'testing_appvoval', 'testing_part_functiong', 'testing_basis', 'testing_id_list', 'testing_time', 'testing_contract_amount', 'testing_completion_time'],
      building_str_list: ['testing2_appvoval', 'testing2_type_id', 'testing2_fire_risk', 'testing2_contract_copy', 'testing2_properties', 'testing2_id_list', 'testing2_basis', 'testing2_contract_amount', 'testing2_time', 'testing2_completion_time'],
      // 保留合同扫描件文件信息
      fileContractCopy: {
        name: '',
        isExport: false,
        url: undefined
      },
      fileContractCopy2: {
        name: '',
        isExport: false,
        url: undefined
      },
      dialogVisible: false,
      userOptions: [],
      systemTypeOptions: [],
      deviceTypeOptions: [],
      size: 'mini',
      isNewDialogShow: false,
      isProjectsDeleteShow: false,
      multipleSelection: [],
      ProjectList: [],
      total: 0,
      isProjectListLoadingShow: true,
      tempFilterOptions: {
        project_name: undefined,
        project_type2_id: undefined,
        project_state2: undefined
      },
      projectTules: {
        name: [{ required: true, message: '请填写项目名称', trigger: 'blur' }],
        label: [{ required: true, message: '请填写项目描述', trigger: 'blur' }],
        cover_area: [{ required: true, message: '请填写占地面积', trigger: 'blur' }],		// 占地面积
        constructing_unit: [{ required: true, message: '请填写委托单位', trigger: 'blur' }],
        constructing_unit_code: [{ required: true, message: '请填写统一社会信用代码', trigger: 'blur' }],
        designed_unit: [{ required: true, message: '请填写设计单位', trigger: 'blur' }],
        construction_unit: [{ required: true, message: '请填写施工单位', trigger: 'blur' }],
        testing_area: [{ required: true, message: '请填写检测面积', trigger: 'blur' }],
        asbuild_time: [{ required: true, message: '请填写竣工日期', trigger: 'change' }],
        asbuild_drawings: [{ required: true, message: '请填写竣工图纸提供情况', trigger: 'blur' }],
        total_building_area: [{ required: true, message: '请填写建筑总面积', trigger: 'blur' }],
        building_type: [{ required: true, message: '请填写建筑类型', trigger: 'blur' }],
        building_floors: [{ required: true, message: '请填写建筑楼层', trigger: 'blur' }],
        building_height: [{ required: true, message: '请填写建筑高度', trigger: 'blur' }],
        testing_time: [{ required: true, message: '请填写检测日期', trigger: 'change' }],
        testing_completion_time: [{ required: true, message: '请填写检测完成日期', trigger: 'change' }],
        contacts: [{ required: true, message: '请填写联系人', trigger: 'blur' }],
        contact_number: [{ required: true, message: '请填写联系电话', trigger: 'blur' }],
        testing_type_id: [{ required: true, message: '请选择检测类型', trigger: 'blur' }],
        testing_scope: [{ required: true, message: '请选择检测范围', trigger: 'blur' }],
        testing_part: [{ required: true, message: '请填写检测部位', trigger: 'blur' }],
        testing_appvoval: [{ required: true, message: '请填写检测批文', trigger: 'blur' }],
        testing_part_functiong: [{ required: true, message: '请填写检测部位使用功能', trigger: 'blur' }],
        testing_basis: [{ required: true, message: '请填写检测依据', trigger: 'blur' }],
        testing_id_list: [{ required: true, message: '请选择检测内容(需检测的系统)', trigger: 'blur' }],
        leader: [{ required: true, message: '请选择项目负责人', trigger: 'blur' }],
        auditor: [{ required: true, message: '请选择审核人', trigger: 'blur' }],
        testing_users: [{ required: true, message: '请选择检测人员', trigger: 'blur' }],
        testing2_appvoval: [{ required: true, message: '请选择检测批文', trigger: 'blur' }],	// 检测批文(备案号)
        testing2_type_id: [{ required: true, message: '请选择项目类型', trigger: 'blur' }], // 项目类型 0=新建、1=扩建、2/3/4/5=改建(3=装修、4=建筑保温、5=用途变更)
        testing2_fire_risk: [{ required: true, message: '请填写火灾危险性', trigger: 'blur' }],	// 火灾危险性
        testing2_properties: [{ required: true, message: '请选使用性质', trigger: 'blur' }], // 使用性质',
        testing2_id_list: [{ required: true, message: '请选择检测内容', trigger: 'blur' }],	// 检测内容',
        testing2_basis: [{ required: true, message: '请填写项目依据', trigger: 'blur' }], // 检测依据',
        testing2_time: [{ required: true, message: '请选择检测日期', trigger: 'blur' }], // 检测日期',
        testing2_completion_time: [{ required: true, message: '请选择检测完成日期', trigger: 'blur' }] // 检测完成日期',
      },
      paramsGetProjects: {
        project_id: undefined,
        page: 1,
        limit: 20
      },
      isEdit: false,
      // 检测项目的formdata对象
      projectFormData: new FormData(),
      paramsNewProjects: {
        project_id: undefined,
        address: '',
        longitude: undefined,
        latitude: undefined,
        label: undefined,
        is_testing: 1,
        is_testing2: 0,
        constructing_unit: undefined, // 委托单位(建设单位)
        constructing_unit_code: undefined,
        designed_unit: undefined,	// 设计单位
        cover_area: undefined,		// 占地面积
        construction_unit: undefined,	// 施工单位(维保单位)
        testing_area: undefined,		// 检测面积(平方米)
        asbuild_time: undefined,	// 竣工日期
        asbuild_drawings: undefined,	// 竣工图纸提供情况
        total_building_area: undefined,	// 建筑总面积(平方米)
        building_type: undefined,	// 建筑类型
        building_floors: undefined,	// 建筑楼层
        building_height: undefined,		// 建筑高度(米)
        testing_time: undefined, // 检测日期
        testing_completion_time: undefined, // 检测完成日期
        contacts: undefined,	// 联系人
        contact_number: undefined,	// 联系电话
        testing_contract_amount: undefined,		// 合同金额(元)
        testing_type_id: undefined,	// 检测类型0=竣工检测、1=年度检测
        testing_scope: undefined,	// 检测范围0=整体检测、1=局部检测
        testing_part: undefined, // 检测部位
        testing_appvoval: undefined,	// 检测批文
        testing_part_functiong: undefined, // 检测部位使用功能
        testing_basis: undefined,	// 检测依据
        testing_id_list: [],	// 检测内容(需检测的系统)
        // 建筑防火检测信息
        testing2_appvoval: undefined,	// 检测批文(备案号)
        testing2_type_id: undefined, // 项目类型 0=新建、1=扩建、2/3/4/5=改建(3=装修、4=建筑保温、5=用途变更)
        testing2_fire_risk: undefined,	// 火灾危险性
        testing2_properties: undefined,	// 使用性质',
        testing2_id_list: [],	// 检测内容',
        testing2_basis: undefined, // 检测依据',
        testing2_contract_amount: undefined,	// 合同金额(元)
        testing2_time: undefined,	// 检测日期',
        testing2_completion_time: undefined, // 检测完成日期',
        // 人员信息
        leader: undefined,		// 项目负责人
        auditor: undefined,	// 审核人
        testing_users: undefined	// 检测人员(多个)
      },
      checkAll1: false,
      isIndeterminate1: false,
      checkAll2: false,
      isIndeterminate2: false
    }
  },
  computed: {
    ...mapGetters([
      'company_id'
    ])
  },
  watch: {
    checkedItems(checkedItems) {
      this.paramsNewProjects.is_testing = checkedItems.includes(1) ? 1 : 0
      this.paramsNewProjects.is_testing2 = checkedItems.includes(2) ? 1 : 0
    }
  },
  created() {
    this.getDeviceTypes()
    this.getProjectFire()
    this.getSystemTypes()
    this.getUserList()
  },
  methods: {
    // objectSpanMethod({ row, column, rowIndex, columnIndex }) {
    //   if ([0, 1, 2, 3, 4, 8].includes(columnIndex)) {
    //     if (this.spanArr[rowIndex]) {
    //       return {
    //         rowspan: this.spanArr[rowIndex],
    //         colspan: 1
    //       }
    //     } else {
    //       return {
    //         rowspan: 0,
    //         colspan: 0
    //       }
    //     }
    //   }
    // },
    // initChartData() {
    //   let contactDot = 0
    //   this.spanArr = []
    //   this.ProjectList.forEach((item, index) => {
    //     if (index === 0) {
    //       this.spanArr.push(1)
    //     } else {
    //       if (item.project_id === this.ProjectList[index - 1].project_id) {
    //         this.spanArr[contactDot] += 1
    //         this.spanArr.push(0)
    //       } else {
    //         contactDot = index
    //         this.spanArr.push(1)
    //       }
    //     }
    //   })
    // },
    // parseProjectData(list) {
    //   const tempArr = []
    //   list.forEach(item => {
    //     const l1 = { project_type: '消防设施' }
    //     const l2 = { project_type: '建筑防火' }
    //     for (const key in item) {
    //       if (['is_finished', 'finished_time', 'is_reported', 'report_time', 'report_path'].includes(key)) {
    //         l1[key] = item[key]
    //       } else if (['is_finished2', 'finished_time2', 'is_reported2', 'report_time2', 'report_path2'].includes(key)) {
    //         l2[key.substr(0, key.length - 1)] = item[key]
    //       } else {
    //         l1[key] = item[key]
    //         l2[key] = item[key]
    //       }
    //     }
    //     tempArr.push(l1, l2)
    //   })
    //   return tempArr
    // },
    onUploadChange() {
      this.isUploadButtonDisable = false
    },
    /**
     * @Description: 上传对话框文件删除时回调
     * @Date: 2019/5/5
     **/
    onUploadFileRemove() {
      this.isUploadButtonDisable = true
    },
    /**
     * @Description: 取消上传操作
     * @Date: 2019/5/5
     **/
    onUploadButtonCancel() {
      this.dialogImportVisible = false
    },
    /**
     * @Description: 上传文件事件
     * @Date: 2019/5/5
     **/
    onUploadButtonSubmit() {
      this.$refs.upload.submit()
    },
    /**
     * @Description: 上传文件类型大小限制
     * @Date: 2019/5/5
     **/
    onUploadFileCheck(file) {
      const testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      const extension = testmsg === 'xls'
      const extension2 = testmsg === 'xlsx'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!extension && !extension2) {
        this.$message({
          message: '上传文件只能是 xls、xlsx格式',
          type: 'warning'
        })
      }
      if (!isLt2M) {
        this.$message({
          message: '上传文件大小不能超过 2MB',
          type: 'warning'
        })
      }
      return extension || extension2 && isLt2M
    },
    /**
     * @Description: 文件数量限制
     * @Date: 2019/5/5
     **/
    onUploadFileLimit() {
      this.$message({
        message: '只能上传一个文件',
        type: 'warning'
      })
    },
    /**
     * @Description: 文件上传操作
     * @Date: 2019/5/5
     **/
    UploadFile(content) {
      this.isButtonUploadLoadingShow = true
      const formData = new FormData()
      formData.append('excel', content.file, content.file.name)
      importTemp(formData).then((res) => {
        const data = res.data
        for (const key in data) {
          if (['asbuild_time', 'testing_time', 'testing_completion_time', 'testing2_time', 'testing2_completion_time'].includes(key)) {
            this.paramsNewProjects[key] = Formattimestamp2(data[key])
          } else if (key === 'testing_id_list' || key === 'testing2_id_list') {
            // 将字符串转化为数组并将将数组项映射成number类型
            this.paramsNewProjects[key] = data[key].split(',').map(item => item * 1)
          } else {
            this.paramsNewProjects[key] = data[key]
          }
        }
        this.$message({
          type: 'success',
          message: '导入成功'
        })
        this.isButtonUploadLoadingShow = false
        this.dialogImportVisible = false
      }).catch(err => {
        console.error(err)
        this.isButtonUploadLoadingShow = false
      })
    },
    exportTemp() {
      exportTemp({ project_id: this.project_id }).then(res => {
        this.$message({ type: 'success', message: '导出成功' })
        const fileName = '项目模板' + '.xlsx'
        const fileDownload = require('js-file-download')
        fileDownload(res.data, fileName)
      }).catch(err => {
        console.error(err)
      })
    },
    downloadReport(info) {
      if (info.is_reported) {
        // open(encodeURIComponent(encodeURI(info.report_path)), 'newBLANK', 'toolbar=yes', 'location=yes')
        // const pathArr = info.report_path.split('/')
        // const filename = pathArr.pop()
        // console.log(pathArr.join('/') + '/' + encodeURI(filename))
        window.open(info.report_path, 'newBLANK', 'toolbar=yes', 'location=yes')
      }
      return
    },
    handleCheckAllChange1(val) {
      this.paramsNewProjects.testing_id_list = val ? this.systemTypeOptions.map(item => item.system_type_id) : []
      this.isIndeterminate1 = false
    },
    handleCheckedChange1(value) {
      const checkedCount = value.length
      this.checkAll1 = checkedCount === this.paramsNewProjects.testing_id_list.length
      this.isIndeterminate1 = checkedCount > 0 && checkedCount < this.systemTypeOptions.length
    },
    handleCheckAllChange2(val) {
      this.paramsNewProjects.testing2_id_list = val ? this.deviceTypeOptions.map(item => item.device_type_id) : []
      this.isIndeterminate2 = false
    },
    handleCheckedChange2(value) {
      const checkedCount = value.length
      this.checkAll2 = checkedCount === this.paramsNewProjects.testing2_id_list.length
      this.isIndeterminate2 = checkedCount > 0 && checkedCount < this.deviceTypeOptions.length
    },
    // 生成报告
    generateReport(info) {
      this.$confirm('是否生成新的报告?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.isGenerateReportLoading = true
        const project_type_id = this.reportFile.project_type === '消防设施' ? 1 : 2
        generateReport({ project_id: this.reportFile.project_id, project_type_id }).then((res) => {
          const data = res.data
          const filename = data.report_path.split('/').pop()
          if (project_type_id === 1) {
            this.reportFile.list[0].filename = filename
            this.reportFile.list[0].is_reported = data.is_reported
            this.reportFile.list[0].report_path = process.env.VUE_APP_FILE_API + data.report_path
            this.reportFile.list[0].report_time = data.is_reported ? Formattimestamp(info.report_time) : '/'
          } else {
            this.reportFile.list[1].filename = filename
            this.reportFile.list[1].is_reported = data.is_reported
            this.reportFile.list[1].report_path = process.env.VUE_APP_FILE_API + data.report_path
            this.reportFile.list[1].report_time = data.is_reported ? Formattimestamp(info.report_time) : '/'
          }
          this.isGenerateReportLoading = false
          this.$message({
            type: 'success',
            message: '新报告生成，需要查看请下载该报告'
          })
        }).catch(err => {
          this.isGenerateReportLoading = false
          console.error(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 下载报告
    // downloadReport() {
    //   if (this.reportFile.url !== '') window.open(this.reportFile.url)
    //   return
    // },
    // 查看报告
    checkReport(info) {
      this.dialogVisible = true
      const fileInfo = {
        list: [{
          is_finished: info.is_finished,
          is_reported: info.is_reported,
          finished_time: info.finished_time,
          project_type: '消防检测',
          report_path: process.env.VUE_APP_FILE_API + info.report_path,
          report_time: info.is_reported ? Formattimestamp(info.report_time) : '/',
          filename: info.report_path.split('/').pop()
        }, {
          is_finished: info.is_finished2,
          finished_time: info.finished_time2,
          is_reported: info.is_reported2,
          project_type: '建筑防火',
          report_path: process.env.VUE_APP_FILE_API + info.report_path2,
          report_time: info.is_reported2 ? Formattimestamp(info.report_time2) : '/',
          filename: info.report_path2.split('/').pop()
        }],
        project_id: info.project_id,
        name: info.name
      }
      this.reportFile = fileInfo
      this.reportFile.project_type = info.project_type
    },
    // 导出文件
    exportFile(name) {
      if (name === 'testing_contract_copy') {
        window.open(this.fileContractCopy.url)
      } else {
        window.open(this.fileTestingScheme.url)
      }
    },
    // 获取从amap组件得到的位置信息
    getPos(pos) {
      this.paramsNewProjects.longitude = pos.slon
      this.paramsNewProjects.latitude = pos.slat
      this.paramsNewProjects.address = pos.sname
    },
    // 关闭窗口
    closeDialog() {
      if (this.isEdit) {
        this.init()
      } else {
        this.$refs.newProjectRuleForm.clearValidate()
      }
      this.isEdit = false
      this.mapOpen = false
      this.fileTestingScheme.isExport = false
      this.fileContractCopy.isExport = false
      this.fileContractCopy2.isExport = false
    },
    // 检测文件是否符合条件
    fileCheck(file) {
      const testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      const extension = testmsg === 'doc'
      const extension2 = testmsg === 'docx'
      const extension3 = testmsg === 'pdf'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!extension && !extension2 && !extension3) {
        this.$message({
          message: '上传文件只能是 doc、docx、pdf格式',
          type: 'warning'
        })
        return false
      }
      if (!isLt2M) {
        this.$message({
          message: '上传文件大小不能超过 2MB',
          type: 'warning'
        })
        return false
      }
      return true
    },
    // 处理检测方案文件改变的函数
    handleFileChange(file, fileList) {
      if (this.fileCheck(file)) {
        if (fileList.length === 1) {
          this.schemefileList = fileList
        } else {
          this.schemefileList = [fileList[1]]
        }
        this.fileTestingScheme.isExport = false
        this.projectFormData.set('testing_scheme', this.schemefileList[0].raw, this.schemefileList[0].name)
      } else {
        if (this.fileTestingScheme.isExport) {
          this.schemefileList = [{ name: this.fileTestingScheme.name }]
        } else {
          this.schemefileList = []
        }
      }
    },
    // 处理合同扫描件改变的函数
    handleFileContractChange(file, fileList) {
      if (this.fileCheck(file)) {
        if (fileList.length === 1) {
          this.contractfileList = fileList
        } else {
          this.contractfileList = [fileList[1]]
        }
        this.fileContractCopy.isExport = false
        this.projectFormData.set('testing_contract_copy', this.contractfileList[0].raw, this.contractfileList[0].name)
      } else {
        if (this.fileContractCopy.isExport) {
          this.contractfileList = [{ name: this.fileContractCopy.name }]
        } else {
          this.contractfileList = []
        }
      }
    },
    // 处理合同扫描件(建筑防火)改变的函数
    handleFileContractChange2(file, fileList) {
      if (this.fileCheck(file)) {
        if (fileList.length === 1) {
          this.contractfileList2 = fileList
        } else {
          this.contractfileList2 = [fileList[1]]
        }
        this.fileContractCopy2.isExport = false
        this.projectFormData.set('testing2_contract_copy', this.contractfileList2[0].raw, this.contractfileList2[0].name)
      } else {
        if (this.fileContractCopy2.isExport) {
          this.contractfileList2 = [{ name: this.fileContractCopy2.name }]
        } else {
          this.contractfileList2 = []
        }
      }
    },
    // 获取用户列表
    getUserList() {
      getUsersByCompany({ company_id: this.company_id }).then(res => {
        this.userOptions = res.data.items
      }).catch(err => {
        console.error(err)
      })
    },
    // 获取系统列表
    getSystemTypes() {
      getSystemTypes({ project_type_id: 1 }).then(res => {
        this.systemTypeOptions = res.data.items
      }).catch(err => {
        console.error(err)
      })
    },
    getDeviceTypes() {
      getDeviceTypes({ system_type_id: 5 }).then((res) => {
        this.deviceTypeOptions = res.data.items
      }).catch(() => {})
    },
    // 打开新建检测项目窗口
    openNewProjectDialog() {
      this.project_id = ''
      this.mapOpen = true
      this.isNewDialogShow = true
    },
    // 确定新建检测项目
    onNewSubmit() {
      this.$refs.newProjectRuleForm.validate(valid => {
        if (valid) {
          this.isNewLoading = true
          for (const key in this.paramsNewProjects) {
            if (this.paramsNewProjects.is_testing && !this.paramsNewProjects.is_testing2) {
              if (!this.building_str_list.includes(key)) {
                this.projectFormData.set(key, this.paramsNewProjects[key])
              }
            } else if (!this.paramsNewProjects.is_testing && this.paramsNewProjects.is_testing2) {
              if (!this.fire_str_list.includes(key)) {
                this.projectFormData.set(key, this.paramsNewProjects[key])
              }
            } else {
              this.projectFormData.set(key, this.paramsNewProjects[key])
            }
            if (['testing_users', 'leader', 'auditor'].includes(key)) {
              this.projectFormData.set(key, JSON.stringify(this.paramsNewProjects[key]))
            }
          }
          // 是否是编辑
          if (this.isEdit) {
            this.projectFormData.set('project_id', this.project_id)
            updateProjectFire(this.projectFormData).then(() => {
              this.isNewLoading = false
              this.$message({
                type: 'success',
                message: '编辑检测项目成功！'
              })
              this.getProjectFire()
              this.isNewLoading = false
              this.isNewDialogShow = false
            }).catch(() => {
              this.isNewLoading = false
            })
          } else {
            addProjectFire(this.projectFormData).then(() => {
              this.isNewLoading = false
              this.init()
              this.$message({
                type: 'success',
                message: '新建检测项目成功！'
              })
              this.getProjectFire()
              this.isNewLoading = false
              this.isNewDialogShow = false
            }).catch(() => {
              this.isNewLoading = false
            })
          }
        }
      })
    },
    // 初始化表单
    init() {
      if (this.$refs.newProjectRuleForm !== undefined) this.$refs.newProjectRuleForm.resetFields()
      this.schemefileList = []
      this.contractfileList = []
      this.contractfileList2 = []
      this.projectFormData = new FormData()
      for (const key in this.paramsNewProjects) {
        if (['testing_id_list', 'testing2_id_list'].includes(key)) {
          this.paramsNewProjects[key] = []
        } else if (['is_testing'].includes(key)) {
          this.paramsNewProjects[key] = 1
        } else if (['is_testing2'].includes(key)) {
          this.paramsNewProjects[key] = 0
        } else {
          this.paramsNewProjects[key] = undefined
        }
        this.checkAll1 = false
        this.isIndeterminate1 = false
        this.isIndeterminate2 = false
        this.checkAll2 = false
      }
      this.checkedItems = [this.paramsNewProjects.is_testing ? 1 : undefined, this.paramsNewProjects.is_testing2 ? 2 : undefined]
    },
    enterProject(pid) {
      this.$store.dispatch('user/SelectProject', pid).then(() => {
        this.$store.dispatch('RemoveRoutes').then(() => {
          this.$router.push({ path: '/projects/info' })
        })
      }).catch(err => {
        console.error(err)
      })
    },
    getTime(time) {
      return Formattimestamp2(time)
    },
    // 打开编辑窗口
    openEditProject(project_id) {
      this.project_id = project_id
      this.isEdit = true
      this.mapOpen = true
      this.isNewDialogShow = true
      detailProjectFire({ project_id }).then(res => {
        const obj = {}
        const data = res.data
        this.pos.slon = data.longitude
        this.pos.slat = data.latitude
        this.pos.sname = data.address
        for (const key in data) {
          if (!['project_id', 'id', 'testing_scheme', 'testing_contract_copy', 'testing2_contract_copy', 'is_finished', 'extension', 'status'].includes(key)) {
            obj[key] = data[key]
          }
          if (['asbuild_time', 'testing_time', 'testing_completion_time', 'testing2_time', 'testing2_completion_time'].includes(key)) {
            obj[key] = Formattimestamp2(data[key])
          }
          if (['leader', 'auditor', 'testing_users'].includes(key)) {
            obj[key] = JSON.parse(data[key])
          }
          if (key === 'testing_id_list' || key === 'testing2_id_list') {
            // 将字符串转化为数组并将将数组项映射成number类型
            obj[key] = data[key].split(',').map(item => item * 1)
          }
          if (key === 'testing_scheme') {
            const fileName = data[key] ? data[key].split('/').pop() : ''
            this.fileTestingScheme.name = fileName
            this.fileTestingScheme.url = process.env.VUE_APP_FILE_API + data[key]
            this.schemefileList = data[key] ? [{ name: fileName }] : []
            this.fileTestingScheme.isExport = !!data[key]
          }
          if (key === 'testing_contract_copy') {
            const fileName = data[key] ? data[key].split('/').pop() : ''
            this.fileContractCopy.name = fileName
            this.fileContractCopy.url = process.env.VUE_APP_FILE_API + data[key]
            this.contractfileList = data[key] ? [{ name: fileName }] : []
            this.fileContractCopy.isExport = !!data[key]
          }
          if (key === 'testing2_contract_copy') {
            const fileName = data[key] ? data[key].split('/').pop() : ''
            this.fileContractCopy2.name = fileName
            this.fileContractCopy2.url = process.env.VUE_APP_FILE_API + data[key]
            this.contractfileList2 = data[key] ? [{ name: fileName }] : []
            this.fileContractCopy2.isExport = !!data[key]
          }
        }
        this.paramsNewProjects = obj
        this.checkedItems = [this.paramsNewProjects.is_testing ? 1 : undefined, this.paramsNewProjects.is_testing2 ? 2 : undefined]
        this.checkAll2 = this.deviceTypeOptions.length === this.paramsNewProjects.testing2_id_list.length
        this.checkAll1 = this.systemTypeOptions.length === this.paramsNewProjects.testing_id_list.length
        this.isIndeterminate1 = this.systemTypeOptions.length > this.paramsNewProjects.testing_id_list.length && this.paramsNewProjects.testing_id_list.length > 0
        this.isIndeterminate2 = this.deviceTypeOptions.length > this.paramsNewProjects.testing2_id_list.length && this.paramsNewProjects.testing2_id_list.length > 0
      })
    },
    /**
     * @Description: 获取项目列表
     * @Date: 2019/5/7
     **/
    getProjectFire() {
      this.isProjectListLoadingShow = true
      this.paramsGetProjects.company_id = this.company_id
      getProjectFire(this.paramsGetProjects).then(response => {
        this.ProjectList = response.data.items
        // this.initChartData()
        this.total = response.data.total
        this.isProjectListLoadingShow = false
      }).catch(err => {
        console.error(err)
        this.isProjectListLoadingShow = false
      })
    },
    /**
     * @Description: 搜索事件
     * @Date: 2019/5/7
     **/
    onSearch() {
      this.paramsGetProjects.page = 1
      this.getProjectFire()
    },
    /**
     * @Description: 列表勾选回调
     * @Date: 2019/5/7
     **/
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    /**
     * @Description: 删除项目
     * @Date: 2019/5/7
     **/
    deleteProjects() {
      this.$confirm('确认删除选中的项目吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.isProjectListLoadingShow = true
        const deleteParam = {
          project_id_list: this.multipleSelection.map(item => item.project_id).toString()
        }
        deleteProjectFire(deleteParam).then(() => {
          this.isProjectListLoadingShow = false
          this.getProjectFire()
        }).catch(err => {
          console.log(err)
          this.isProjectListLoadingShow = false
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .app-title-item {
    margin-left: 10px;
    margin-bottom: 10px;
    margin-top: 12px;
    .company-text{
      line-height: 48px;
      display: block;
      font-size: 26px;
      font-weight: 600;
    }
    .title {
      color: #409EFF;
      font-size: 30px;
      font-weight: 2000;
    }
    .tip-text{
      text-align: center;
      display: block;
      line-height: 36px;
    }
  }
  .project-list {
    .button {
      float: right;
    }
  }
  .el-form-item{
    margin-bottom: 15px;
  }
  /deep/.dialog-form-item {
    margin-right: 0;
  }
  .divider {
    height: 100%;
    width: 100%;
    text-align: center;
    /deep/.el-divider--vertical {
      margin: 0 auto;
      height: 100%;
    }
  }
  /deep/.el-drawer__body{
    padding: 0;
  }
  /deep/.el-drawer__body{
    display: flex;
    flex-direction: column;
    padding: 0;
    height: 0
  }
  .project {
    overflow: auto;
    flex: 1;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    display: flex;
    flex-direction: column;
    height: 100%;
    .button {
      padding: 10px;
      text-align: right;
    }
    .title {
      width: 100%;
      height: 50px;
      font-size: 17px;
      line-height: 50px;
      color: #666c75;
      padding-left: 25px;
      font-weight: 500;
      border-top:1px solid #dcdfe6;
      border-bottom: 1px solid #dcdfe6;
      margin-bottom: 15px;
    }
    .checkbox {
      padding: 5px;
      border: 1px solid #DCDFE6;
      border-radius: 4px;
    }
    /deep/.el-form-item__label {
      width: 148px;
      text-align: right;
      padding: 0;
    }
    /deep/.el-form-item__content{
      margin-left: 148px;
    }
    button {
      flex: 0 0 140px;
    }
  }
  .dialog-footer{
    flex: 0 0 80px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
