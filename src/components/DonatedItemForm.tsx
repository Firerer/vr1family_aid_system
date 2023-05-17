import React, { useEffect, useState } from 'react';

import z from "zod";
import { RequestItemType, ItemRequest as ItemRequestSchema, DonatedItem, DonorSchema } from "prisma/zod";
import { Select } from "./Form";
import { api } from "~/utils/api";
import { Form, Field } from "./Form";
import { AidCategory, AidItem, Donor, Kit } from '@prisma/client';

type DonatedItemT = z.infer<typeof DonatedItem>;

export default function DonatedItemForm() {

  const getAllQuery = api.aidCategory.getAll.useQuery;
  const categories = getAllQuery()?.data ?? [];
  const getDonors = api.aidDoner.getAll.useQuery;
  const donors = getDonors()?.data??[];
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>('');
  const [selectedDonorInfo, setSelectedDonorInfo] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<AidCategory>();
  const [selectedDonor, setSelectedDonor] = useState<Donor>()
  const [quantity, setQuantity] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [selectedItemName, setSelectedItemName] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<AidItem>();
  const donatedItemApi = api.donatedItemRequest.create.useMutation();
  useEffect(() => {
    //initilize `Aid Item`
    if (categories.length > 0) {
      setSelectedCategoryName(categories[0]?.name ?? '');
      setSelectedCategory(categories[0])
      if(categories[0]?.items.length>0){
        setSelectedItemName(categories[0]?.items[0]?.name)
        setSelectedItem(categories[0]?.items[0])
      }
    }

    if (donors.length > 0) {
      setSelectedDonorInfo("Name: "+donors[0]?.name +" | Phone: "+donors[0]?.phoneNumber);
      setSelectedDonor(donors[0])
    }
  }, [categories,donors]);

  const updateTableData = () => {
    event.preventDefault();
    if(selectedDonorInfo=="" || Number.isNaN(quantity) || quantity==0){
      console.log("invalid input")
      return;
    }
    console.log(selectedDonorInfo)
    const fields =selectedDonorInfo.split(" | ")
    const name = fields[0]?.replace("Name: ","");
    const phone = fields[1]?.replace("Phone: ","");
    setTableData([...tableData, { category: selectedCategoryName,itemName:selectedItemName, quantity,donorName:name,donorPhone:phone }]);  
    console.log(selectedDonor)
    console.log(selectedItem)
  };
  return (
    <form>
      <h3>Record Donated Item</h3>
      <div className="grid">
      <Select name='Donor' 
      options={donors.map((donor)=>"Name: "+donor.name+" | Phone: "+donor.phoneNumber)}
      value={selectedDonorInfo}
      onChange={(e)=>{
        //set donor
        setSelectedDonorInfo(e.target.value)
        const fields =e.target.value.split(" | ")
        const name = fields[0]?.replace("Name: ","");
        const phone = fields[1]?.replace("Phone: ","");
        const selectedDonor = donors.find(donor => donor.name == name && donor.phoneNumber ==phone);
        setSelectedDonor(selectedDonor)
      }}
      />
      <Select
        name="Aid Item Category"
        options={categories?.map((category) => category.name)}
        value={selectedCategoryName}
        onChange={(e) => {
          setSelectedCategoryName(e.target.value);
          const selectedCategory = categories.find(category => category.name == e.target.value);
          setSelectedCategory(selectedCategory)
        }}
      />
      {selectedCategoryName && (
        <Select id="aid-item-select" name="Aid Item"  
        options={selectedCategory.items?.map((item) => item.name)} 
        value={selectedItemName} 
        onChange={(e)=>{
          setSelectedItemName(e.target.value);
          const selectedItem = selectedCategory.items.find(item => item.name == e.target.value);
          setSelectedItem(selectedItem)
        }} />
      )}  
        <Field name="quantity" type="number" onChange={(e) => setQuantity(e.target.valueAsNumber)} />
        <button onClick={updateTableData} type='button'>Add to Table</button>
      </div>
      
      <div className='grid'>
        <table>
          <caption><h5>Donated Items</h5></caption>
          <thead>
            <tr>
              <th>Category</th>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>Donor Name</th>
              <th>Donor Phone Number</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index}>
                <td>{row.category}</td>
                <td>{row.itemName}</td>
                <td>{row.quantity}</td>
                <td>{row.donorName}</td>
                <td>{row.donorPhone}</td>
                <td>
                  <button onClick={() => {
                    const updatedTableData = [...tableData];
                    updatedTableData.splice(index, 1);
                    setTableData(updatedTableData);
                  }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button type='submit' onClick={(e)=>{
        e.preventDefault()
        
        tableData.forEach(async (row) => {
          const selectedCategory = categories.find(category=>category.name==row.category);
          const selectedItem = selectedCategory.items.find((item) => item.name == row.itemName);
          const donor = donors.find((donor)=>donor.name==row.donorName && donor.phoneNumber == row.donorPhone);
          const requestData = {
            //donor: donor, 
            //aidItem: selectedItem,
            donorId:donor.id,
            aidItemId:Number(selectedItem.id),
            quantity: Number(row.quantity),
          };
          donatedItemApi.mutate(requestData);
          if (donatedItemApi.isError) {
            console.log(donatedItemApi.error);
          }
          console.log(donatedItemApi.data);
        });
      }}>Submit</button>
    </form>
  );
}
