

const paylod=JSON.parse(process.env.PAYLOAD);
console.log(payload);












// const fs = require('fs');
// const shell = require('shelljs');


// let cloudPlatform;
// let resourceName;
// let environment;
// let hostingRegion;


// const main= async ()=> {
// try {
//     const payloadData=JSON.parse(fs.readFileSync('./myPayload.json'))
//     console.log(payloadData);
//     // 1. copy the files of template into product line folder 
//     cloudPlatform=payloadData.cloud_platform;
//     resourceName=payloadData.resource_name;
//     environment=payloadData.environment;
//     hostingRegion=payloadData.hosting_region || "eastus";
//     //console.log(cloudPlatform);
//     //console.log(resourceName);
//     //console.log(environment);
//     //console.log(hostingRegion);

//     tfTemplateFolder='./templates';
//     console.log("tfTemplateFolder: ", tfTemplateFolder);
//     let payloadProjectName=payloadData.project_name;
//     //console.log(payloadProjectName);
//     let tfFilesPath=`./${payloadProjectName}/${payloadData.hosting_region}`;
//     if(!fs.existsSync(tfFilesPath))
//     {
//         console.log("File not exist");
//         await shell.mkdir('-p',tfFilesPath)
//     }
//     else {
//         console.log("file exist");
//         await shell.rm("-rf", `./${tfFilesPath}/*`);
//       }
      
//     const resources = payloadData.resources
//     for(let i=0;i<resources.length;i++){
//        const resourceId = i+1
//        await readAndAppendContents(
//         "main",
//         resources[i].resource_type,
//         payloadProjectName,
//         payloadData.hosting_region,
//         resourceId
//       );

//       // update data.tf
//       await readAndAppendContents(
//         "data",
//         resources[i].resource_type,
//         payloadProjectName,
//         payloadData.hosting_region,
//         resourceId
//       );

//       // update outputs.tf
//       await readAndAppendContents(
//         "outputs",
//         resources[i].resource_type,
//         payloadProjectName,
//         payloadData.hosting_region,
//         resourceId
//       );

//       // update variables.tf
//       await readAndAppendContents(
//         "variables",
//         resources[i].resource_type,
//         payloadProjectName,
//         payloadData.hosting_region,
//         resourceId
//       );
//     }
//     let generatedVariables = [];

//       for (let loopvar = 0; loopvar < resources.length; loopvar++) {
//         const rsrcType = resources[loopvar].resource_type;
//         const rsrcVars = getResourceVars(rsrcType) || [];
//         const rscPid = loopvar+1;
//         for (
//           let rsrcVarsLoopVar = 0;
//           rsrcVarsLoopVar < rsrcVars.length;
//           rsrcVarsLoopVar++
//         ) {
//           const rsrcVar = rsrcVars[rsrcVarsLoopVar];
//           generatedVariables.push({
//             ...rsrcVar,
//             key: rsrcVar.key + rscPid,
//           });
//         }
//       }
//       fs.writeFileSync(
//         `./${payloadProjectName}/${payloadData.hosting_region}/all_vars.json`,
//         JSON.stringify(generatedVariables, null, 4),
//         "utf8"
//       );

//       await shell.cp(
//         `${tfTemplateFolder}/providers/${cloudPlatform}/provider.tf`,
//         `./${payloadProjectName}/${payloadData.hosting_region}`
//       );  

//       let tfVarsContent = "";
//       for (let c = 0; c < generatedVariables.length; c++) {
//         // const generatedVariableskeys = Object.values(generatedVariables[c]) || []
//         // const resouceDetails = payloadData.accounts[i].resources[c].details
//         // console.log("redet: ", resouceDetails)
//         const generatedVar = generatedVariables[c];
//         // console.log("gen:", generatedVar);
//         let value = "";
//         if (generatedVar.action === "NameEngineLookup") {
//           value="";
//           // value = await variableActions.generateName(
//           //   1,
//           //   platform,
//           //   applicationName,
//           //   payloadProjectName,
//           //   environmentName,
//           //   generatedVar.resource_name,
//           //   region,
//           //   accName
//           // );
//         }

//         if (generatedVar.action === "None") {
//           let key = generatedVar.key;
//           //                     let rsId = key.slice(-1);
//           //                     let newKey = key.slice(0, key.length - 1);
//           for (let rs = 0; rs < resources.length; rs++) {
//             resourceDetails = JSON.parse(resources[rs].details);
//             let pid=rs+1;
//             let pidcount = `${pid}`.length;
//             let rsId = key.slice(-1 * pidcount);
//             let newKey = key.slice(0, key.length - pidcount);
//             if (resourceDetails[newKey] && rsId === pid) {
//               value = resourceDetails[newKey];
//               break;
//             } else {
//               value = generatedVar.value;
//             }
//           }
//         }
//         if (value[0] !== "[") {
//           value = `"${value}"`;
//         }
//         if (!tfVarsContent) {
//           tfVarsContent = `${generatedVar.key} = ${value}`;
//         } else {
//           tfVarsContent =
//             tfVarsContent + "\n" + `${generatedVar.key} = ${value}`;
//         }
//       }
//       fs.writeFileSync(
//         `${payloadProjectName}/${payloadData.hosting_region}/terraform.tfvars`,
//         tfVarsContent,
//         "utf8"
//       );
//       const backendTemp = fs.readFileSync(
//         `${tfTemplateFolder}/providers/azure/backend.tf`,
//         "utf8"
//       );
//       const backendData = backendTemp.replace(
//         /path = "somepath"/g,
//         `path = "${payloadProjectName}/${payloadData.hosting_region}/terraform.tfstate"`
//       );
//       fs.writeFileSync(
//         `${payloadProjectName}/${payloadData.hosting_region}/backend.tf`,
//         backendData,
//         "utf8"
//       );


        
      


//     // 2. create a json file having variable name and its default value
//     // 3. check all the variables sent by user map the variable and dump it in tfvars
//     // 4. fs read write
//     } 
// catch (error) 
//     {
//     console.log(error);
//     }
// }

// async function readAndAppendContents(
//     typeOfFile,
//     resourceType,
//     projectName,
//     region,
//     loopIndex
//   ) {
//     try {
//       const templateFileData = fs.readFileSync(
//         `${tfTemplateFolder}/${resourceType}/${resourceType}_${typeOfFile}.tf`,
//         "utf8"
//       );
//       var formattedFileData = templateFileData
//           .replace(/\$loopvar/g, loopIndex)
//     //   if (parentIndex == null) {
//     //     var formattedFileData = templateFileData
//     //       .replace(/\$loopvar/g, loopIndex)
//     //       .replace(/\$parent_index/g, parentIndex);
//     //   } else {
//     //     formattedFileData = templateFileData;
//     //     parentIndex.find((ele) => {
//     //       // let tempRes = ele.slice(0, ele.length - 1);
//     //       let tempRes = ele.split("_");
//     //       let prregex = `${tempRes[0]}$parentindex`;
//     //       formattedFileData = formattedFileData
//     //         .replace(/\$loopvar/g, loopIndex)
//     //         .replace(new RegExp(`${tempRes[0]}\\$parentindex`, "g"), ele);
//     //     });
//     //   }
//       if (
//         fs.existsSync(
//           `./${projectName}/${region}/${resourceType}_${typeOfFile}.tf`
//         )
//       ) {
//         const fileData = fs.readFileSync(
//           `./${projectName}/${region}/${resourceType}_${typeOfFile}.tf`,
//           "utf8"
//         );
//         const updatedFileData = fileData + "\n" + formattedFileData;
//         fs.writeFileSync(
//           `./${projectName}/${region}/${resourceType}_${typeOfFile}.tf`,
//           updatedFileData,
//           "utf8"
//         );
//       } else {
//         fs.writeFileSync(
//           `./${projectName}/${region}/${resourceType}_${typeOfFile}.tf`,
//           formattedFileData,
//           "utf8"
//         );
//       }
//     } catch (error) {
//       throw new Error(`Error in readAndAppendContents: ${error.message}`);
//     }
//   }

// function getResourceVars(resourceType) {
//     try {
//       console.log(resourceType);
//       const resourceConfigData = JSON.parse(
//         fs.readFileSync(
//           `${tfTemplateFolder}/${resourceType}/${resourceType}_config.json`
//         )
//       );
//       return resourceConfigData.parameters;
//     } catch (error) {
//       throw new Error(`Error in getResourceVars: ${error.message}`);
//     }
//   }
// main();
