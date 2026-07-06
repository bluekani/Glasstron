/*
   Copyright 2020 AryToNeX

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
"use strict";

const execFile = require("util").promisify(require("child_process").execFile);
const fs = require("fs").promises;
const _path = require("path");

async function exists(path){
	try{
		await fs.stat(path);
		return true;
	}catch(err){
		if(err && err.code === "ENOENT")
			return false;
		throw err;
	}
}

async function bindings(){
	const buildNodePath = _path.resolve(__dirname, "build", "Release", "dwm.node");
	const nativeNodePath = _path.resolve(__dirname, "native", "dwm.node");
	const npmCliPath = _path.resolve(_path.dirname(process.execPath), "node_modules", "npm", "bin", "npm-cli.js");

	if(!(await exists(buildNodePath))){
		if(await exists(nativeNodePath)){
			console.log("Glasstron's native DWM addon is already available.");
			return;
		}

		try{
			await execFile(process.execPath, [npmCliPath, "exec", "--yes", "--", "node-gyp", "rebuild"], {cwd: __dirname});
		}catch(err){
			console.log("Error while compiling the native addon.");
			throw err;
		}
		console.log("Node-gyp finished. Cleaning up...");
	}else{
		console.log("Glasstron's native DWM addon was built. Cleaning up...");
	}

	if(await exists(nativeNodePath))
		await fs.unlink(nativeNodePath);

	await fs.rename(buildNodePath, nativeNodePath);
	if(await exists(_path.resolve(__dirname, "build")))
		await removeRecursive(_path.resolve(__dirname, "build"));
	console.log("Done!");
}

async function removeRecursive(path){
	const stat = await fs.stat(path);
	if(stat.isDirectory()){
		const sub = await fs.readdir(path);
		for(let subpath of sub){
			await removeRecursive(_path.join(path, subpath));
		}
		await fs.rmdir(path);
	}else
		await fs.unlink(path);
}

bindings();
