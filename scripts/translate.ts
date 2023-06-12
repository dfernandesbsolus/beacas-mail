import { merge } from "lodash";
import { extract, translate } from "easy-localized-translation";
import * as fs from "fs-extra";
import * as dotenv from "dotenv";
import path from "path";

const overwriteData = fs.readJsonSync(
  path.join(
    process.cwd(),
    "packages/beacas-localization/locales/overwrite.json"
  )
);

const config = dotenv.config();

async function main() {
  const packagesWords = extract({
    path: "packages",
    keyword: "t",
    excludeDir: ["node_modules"],
    includes: ["\\*.tsx", "\\*.jsx", "\\*.ts", "\\*.js"],
  });

  const words = [...packagesWords];

  const translateWords = await translate(words, {
    from: "en",
    locales: [
      "zh-Hans",
      "da",
      "nl",
      "fr",
      "de",
      "hu",
      "it",
      "pt",
      "ru",
      "es",
      "sv",
      "hr",
      "fi",
      "el",
      "ja",
      "nb",
      "pl",
      "ro",
      "tr",
      "id",
      "sl",
      "ar",
    ],
    servicesAccount: {
      private_key: config.parsed!.private_key!, // NEED services account
      client_email: config.parsed!.client_email!, // NEED services account
    },
  });

  Object.keys(translateWords).forEach((lan) => {
    const combineData = { ...translateWords[lan], ...overwriteData[lan] };

    fs.writeFileSync(
      `packages/beacas-localization/locales/${lan}.json`,
      JSON.stringify(combineData, null, 2)
    );
  });

  fs.writeFileSync(
    `packages/beacas-localization/locales/locales.json`,
    JSON.stringify(merge(translateWords, overwriteData), null, 2)
  );
}
main();
