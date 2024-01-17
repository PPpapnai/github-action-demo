const fs = require("fs");
// const AWS = require('aws-sdk');
const shell = require("shelljs");
const VariableActions = require("./VariableActions");
require("dotenv/config");

const variableActions = new VariableActions();
let platform;
let applicationName;
let environmentName;
let region;

async function main() {
  try {
    // read the payload

    const snowData = JSON.parse(process.env.PAYLOAD);
    // const payloadData = JSON.parse(snowData.result.u_json)
    const payloadData = snowData;
    console.log(payloadData);
    // const snowData = JSON.parse(fs.readFileSync('./payload.json'))
    // const payloadData = snowData
    // console.log(snowData)

    platform = payloadData.platform;
    applicationName = payloadData.additional_details.application_sku;
    environmentName = payloadData.environment;
    region = payloadData.location || "ap-south-1";

    console.log(platform);

    let baseWorkSpacePath = process.env.workspacePath;

    // setting the template folder path
    tfTemplateFolder = process.env.TF_TEMPLATE_PATH || "./templates";

    console.log("tfTemplateFolder: ", tfTemplateFolder);

    let payloadProjectName = payloadData.additional_details.project_name || "";
    let accounts = payloadData.accounts || [];

    console.log("Project Name: ", payloadProjectName);

    if (!fs.existsSync(`${payloadProjectName}`)) {
      console.log("file not exist");
      await shell.mkdir(`${payloadProjectName}`);
    } else {
      console.log("file exist");
      await shell.rm("-rf", `./${payloadProjectName}/*`);
    }

    let resourceTypeWithLastIndex = {};
    for (let i = 0; i < accounts.length; i++) {
      // let resourceTypelist = {}
      // let resourceTypeWithLastIndex = {}
      if (!fs.existsSync(`${payloadProjectName}/${accounts[i].account_name}`)) {
        await shell.mkdir(`${payloadProjectName}/${accounts[i].account_name}`);
      } else {
        await shell.rm(
          "-rf",
          `./${payloadProjectName}/${accounts[i].account_name}/*`
        );
      }
      console.log(accounts[i].resources.length);
      let accountName = accounts[i].account_name;
      let resources = accounts[i].resources || [];
      let accName = accountName.slice(0, 3);
      for (let j = 0; j < resources.length; j++) {
        let mainIndex = 0;
        if (resourceTypeWithLastIndex[resources[j].resource_type]) {
          mainIndex = resourceTypeWithLastIndex[resources[j].resource_type];
        }
        mainIndex = mainIndex + 1;
        // console.log(resources[j])
        //for vpc
        let li = 1;
        let pi = 1;

        if (resources[j].depends_on.length == 0) {
          li = resources[j].pid;
          pi = null;

          await readAndAppendContents(
            "main",
            resources[j].resource_type,
            payloadProjectName,
            accountName,
            li,
            pi
          );

          // update data.tf
          await readAndAppendContents(
            "data",
            resources[j].resource_type,
            payloadProjectName,
            accountName,
            li,
            pi
          );

          // update outputs.tf
          await readAndAppendContents(
            "outputs",
            resources[j].resource_type,
            payloadProjectName,
            accountName,
            li,
            pi
          );

          // update variables.tf
          await readAndAppendContents(
            "variables",
            resources[j].resource_type,
            payloadProjectName,
            accountName,
            li,
            pi
          );
        } else if (
          resources[j].depends_on.length >= 1 &&
          resources[j].depends_on.length !== 0
        ) {
          li = resources[j].pid;
          pi = resources[j].depends_on;

          await readAndAppendContents(
            "main",
            resources[j].resource_type,
            payloadProjectName,
            accountName,
            li,
            pi
          );

          // update data.tf
          await readAndAppendContents(
            "data",
            resources[j].resource_type,
            payloadProjectName,
            accountName,
            li,
            pi
          );

          // update outputs.tf
          await readAndAppendContents(
            "outputs",
            resources[j].resource_type,
            payloadProjectName,
            accountName,
            li,
            pi
          );

          // update variables.tf
          await readAndAppendContents(
            "variables",
            resources[j].resource_type,
            payloadProjectName,
            accountName,
            li,
            pi
          );
        }

        // resourceTypelist[resources[j].resource_type] = j
        resourceTypeWithLastIndex[resources[j].resource_type] = mainIndex;
      }

      console.log("poo: ", resourceTypeWithLastIndex);

      let generatedVariables = [];

      for (let loopvar = 0; loopvar < resources.length; loopvar++) {
        const rsrcType = resources[loopvar].resource_type;
        const rsrcVars = getResourceVars(rsrcType) || [];
        const rscPid = resources[loopvar].pid;
        for (
          let rsrcVarsLoopVar = 0;
          rsrcVarsLoopVar < rsrcVars.length;
          rsrcVarsLoopVar++
        ) {
          const rsrcVar = rsrcVars[rsrcVarsLoopVar];
          generatedVariables.push({
            ...rsrcVar,
            key: rsrcVar.key + rscPid,
          });
        }
      }

      fs.writeFileSync(
        `./${payloadProjectName}/${accountName}/all_vars.json`,
        JSON.stringify(generatedVariables, null, 4),
        "utf8"
      );

      await shell.cp(
        `${tfTemplateFolder}/providers/${platform}/provider.tf`,
        `./${payloadProjectName}/${accountName}`
      );

      let tfVarsContent = "";
      for (let c = 0; c < generatedVariables.length; c++) {
        // const generatedVariableskeys = Object.values(generatedVariables[c]) || []
        // const resouceDetails = payloadData.accounts[i].resources[c].details
        // console.log("redet: ", resouceDetails)
        const generatedVar = generatedVariables[c];
        // console.log("gen:", generatedVar);
        let value = "";
        if (generatedVar.action === "NameEngineLookup") {
          value="";
          // value = await variableActions.generateName(
          //   1,
          //   platform,
          //   applicationName,
          //   payloadProjectName,
          //   environmentName,
          //   generatedVar.resource_name,
          //   region,
          //   accName
          // );
        }

        if (generatedVar.action === "None") {
          let key = generatedVar.key;
          //                     let rsId = key.slice(-1);
          //                     let newKey = key.slice(0, key.length - 1);
          for (let rs = 0; rs < resources.length; rs++) {
            resourceDetails = JSON.parse(resources[rs].details);
            let pidcount = resources[rs].pid.length;
            let rsId = key.slice(-1 * pidcount);
            let newKey = key.slice(0, key.length - pidcount);
            if (resourceDetails[newKey] && rsId === resources[rs].pid) {
              value = resourceDetails[newKey];
              break;
            } else {
              value = generatedVar.value;
            }
          }
        }
        if (value[0] !== "[") {
          value = `"${value}"`;
        }
        if (!tfVarsContent) {
          tfVarsContent = `${generatedVar.key} = ${value}`;
        } else {
          tfVarsContent =
            tfVarsContent + "\n" + `${generatedVar.key} = ${value}`;
        }
      }

      const newRegion = `region = "${region}"`;
      tfVarsContent = tfVarsContent + "\n" + newRegion;
      fs.writeFileSync(
        `${payloadProjectName}/${accountName}/terraform.tfvars`,
        tfVarsContent,
        "utf8"
      );

      if (!fs.existsSync(`${baseWorkSpacePath}`)) {
        await shell.mkdir(`${baseWorkSpacePath}`);
      } else {
        await shell.rm("-rf", `./${baseWorkSpacePath}/*`);
      }

      const backendTemp = fs.readFileSync(
        `${tfTemplateFolder}/providers/azure/backend.tf`,
        "utf8"
      );
      const backendData = backendTemp.replace(
        /path = "somepath"/g,
        `path = "${baseWorkSpacePath}/${payloadProjectName}/${accountName}/terraform.tfstate"`
      );
      fs.writeFileSync(
        `${payloadProjectName}/${accountName}/backend.tf`,
        backendData,
        "utf8"
      );
    }
  } catch (error) {
    throw new Error(`Error in readAndAppendContents: ${error.message}`);
  }
}

async function readAndAppendContents(
  typeOfFile,
  resourceType,
  projectName,
  accountName,
  loopIndex,
  parentIndex
) {
  try {
    const templateFileData = fs.readFileSync(
      `${tfTemplateFolder}/${resourceType}/${resourceType}_${typeOfFile}.tf`,
      "utf8"
    );
    if (parentIndex == null) {
      var formattedFileData = templateFileData
        .replace(/\$loopvar/g, loopIndex)
        .replace(/\$parent_index/g, parentIndex);
    } else {
      formattedFileData = templateFileData;
      parentIndex.find((ele) => {
        // let tempRes = ele.slice(0, ele.length - 1);
        let tempRes = ele.split("_");
        let prregex = `${tempRes[0]}$parentindex`;
        formattedFileData = formattedFileData
          .replace(/\$loopvar/g, loopIndex)
          .replace(new RegExp(`${tempRes[0]}\\$parentindex`, "g"), ele);
      });
    }
    if (
      fs.existsSync(
        `./${projectName}/${accountName}/${resourceType}_${typeOfFile}.tf`
      )
    ) {
      const fileData = fs.readFileSync(
        `./${projectName}/${accountName}/${resourceType}_${typeOfFile}.tf`,
        "utf8"
      );
      const updatedFileData = fileData + "\n" + formattedFileData;
      fs.writeFileSync(
        `./${projectName}/${accountName}/${resourceType}_${typeOfFile}.tf`,
        updatedFileData,
        "utf8"
      );
    } else {
      fs.writeFileSync(
        `./${projectName}/${accountName}/${resourceType}_${typeOfFile}.tf`,
        formattedFileData,
        "utf8"
      );
    }
  } catch (error) {
    throw new Error(`Error in readAndAppendContents: ${error.message}`);
  }
}

function getResourceVars(resourceType) {
  try {
    console.log(resourceType);
    const resourceConfigData = JSON.parse(
      fs.readFileSync(
        `${tfTemplateFolder}/${resourceType}/${resourceType}_config.json`
      )
    );
    return resourceConfigData.parameters;
  } catch (error) {
    throw new Error(`Error in getResourceVars: ${error.message}`);
  }
}

main();
