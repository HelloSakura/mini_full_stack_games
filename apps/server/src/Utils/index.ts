import fs from "fs-extra";
import path from "path";

export const getTime = () => new Date().toLocaleString().split("├")[0];

//symlink同步
export const symlinkCommon = async () => {
  const dst = path.resolve(__dirname, "../Common");
  const src = path.resolve(__dirname, "../../../client/assets/Scripts/Common");

  if (
    (await fs
      .lstat(dst)
      .then((v) => v.isSymbolicLink())
      .catch(() => false)) &&
    (await fs.readlink(dst)) === src
  ) {
    console.log("同步成功！");
  } else {
    fs.symlink(src, dst)
      .then(() => {
        console.log("同步成功！");
      })
      .catch((e) => {
        console.log("同步失败！", e);
      });
  }
};