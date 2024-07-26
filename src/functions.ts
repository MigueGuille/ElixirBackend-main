import { StartServerProps } from "./types";
import picocolors from "picocolors";

export function startServer({ app, PORT }: StartServerProps) {
  app.listen(PORT, () => {
    console.log(
      picocolors.bgBlack(picocolors.green(`SERVER RUNNING ON PORT ${PORT}`))
    );
  });

  return;
}
