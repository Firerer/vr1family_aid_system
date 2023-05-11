import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import AidDonorForm from "src/components/AidDonorForm";
import AidRecipientForm from "~/components/AidRecipientForm";
import AidCategoryForm from "~/components/AidCategoryForm";
import AidKitForm from "~/components/AidKitForm";
import AidItemForm from "~/components/AidItemForm";
import ItemRequestForm from "~/components/ItemRequestForm";
import DonatedItemForm from "~/components/DonatedItemForm";

// const prepopulate =
//   "Dry Food Items, Hot Food Items, Personal Hygiene, Warm Clothing, Casual Clothing, Bedding, Footwear, Electrical Supplies and Furniture Supplies";
// const cates = prepopulate.split(",").map((cate) => cate.trim());
// <p>{"Prepopulate with: " + prepopulate}</p>
// <button onClick={() => mutate.mutate({ name: "test" })}>test</button>
const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>vr1family_aid_system</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container">
        <nav>
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
          </ul>
        </nav>
        <AidKitForm />
        <AidItemForm />
        <AidCategoryForm />
        <AidRecipientForm />
        <AidDonorForm />
        <ItemRequestForm />
        <DonatedItemForm />
      </main>
    </>
  );
};

export default Home;
