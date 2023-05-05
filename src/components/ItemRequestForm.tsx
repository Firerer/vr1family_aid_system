import React, { useEffect, useState } from 'react';

import z from "zod";
import { RequestItemType, ItemRequest as ItemRequestSchema } from "prisma/zod";
import { Select } from "./Form";
import { api } from "~/utils/api";
import { Form, Field } from "../components/Form";
import { AidCategory, Kit } from '@prisma/client';

type ItemRequestT = z.infer<typeof ItemRequestSchema>;

export default function ItemRequestForm() {
  const [itemType, setItemType] = useState<ItemRequestT["itemType"]>(
    RequestItemType.enum['Pre-packed Aid Kits'],
  );
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>('');
  const [selectedKit, setSelectedKit] = useState<Kit>();
  const [selectedKitName, setSelectedKitName] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<AidCategory>();
  const [selectedItemName, setSelectedItemName] = useState<string>('');
  const getAllQuery = api.aidCategory.getAll.useQuery;
  const categories = getAllQuery()?.data ?? [];
  const getKits = api.aidKit.getAll.useQuery;
  const kits = getKits()?.data ?? [];
  const [quantity, setQuantity] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [note, setNote] = useState('');
  const mutate = api.itemRequest.create.useMutation();

  useEffect(() => {
    //initilize `Aid Item`
    if (categories.length > 0) {
      setSelectedCategoryName(categories[0]?.name ?? '');
      setSelectedCategory(categories[0])
      if(categories[0]?.items.length>0){
        setSelectedItemName(categories[0]?.items[0]?.name)
      }
    }
    if(kits.length>0){
      setSelectedKitName(kits[0]?.name??"")
      setSelectedKit(kits[0])
    }
  }, [categories,kits]);

  const updateTableData = () => {
    event.preventDefault();
    if(itemType==""){
      console.log("invalid input")
      return;
    }
    if(itemType==RequestItemType.Enum['Individual Items']){
      if(selectedCategoryName=="" || selectedItemName==""||Number.isNaN(quantity) || quantity==0){
        console.log("invalid input")
        return;
      }
      setTableData([...tableData, { itemType, category: selectedCategoryName,itemName:selectedItemName, quantity }]);
    }

    if(itemType==RequestItemType.Enum['Pre-packed Aid Kits']){
      if(selectedKitName=="" || Number.isNaN(quantity) || quantity==0){
        console.log("invalid input")
        return;
      }
      const kitItemTable = document.querySelector('#kit-item-table');
      console.log(kitItemTable.rows.length)
      const hasRows = kitItemTable && kitItemTable.rows.length > 1;
      if(!hasRows){
        console.log("no items have been added")
        return;
      }
      setTableData([...tableData, { itemType, category: selectedKitName,itemName:"Items included in "+selectedKitName, quantity }]);
    }

    
  };
  const handleNoteChange = (event) => {
    setNote(event.target.value);
  }
  return (
    <form>
      <h3>Item Request Form</h3>
      <div className="grid">
      <Select
        name="Item Type"
        options={RequestItemType.options}
        onChange={(e) => {
          setItemType(e.currentTarget.value);
        }}
      />
      {itemType === RequestItemType.Enum['Individual Items'] && (
        <>
          <Select
            name="Aid Item Category"
            options={categories?.map((category) => category.name)}
            value={selectedCategoryName}
            onChange={(e) => {
              setSelectedCategoryName(e.target.value);
              const selectedCategory = categories.find(category => category.name == e.target.value);
              setSelectedCategory(selectedCategory)
              console.log(selectedCategory)
            }}
          />
          
          {selectedCategoryName && (
            <Select id="aid-item-select" name="Aid Item"  options={selectedCategory.items?.map((item) => item.name)} value={selectedItemName} onChange={(e)=>{
              setSelectedItemName(e.target.value);
              
            }} />
          )}  
        </>
      )}
      {itemType === RequestItemType.Enum['Pre-packed Aid Kits'] && (
        <>
          <Select
            name="Aid Kits"
            options={kits?.map((kit) => kit.name)}
            value={selectedKitName}
            onChange={(e) => {
              setSelectedKitName(e.target.value);
              const selectedKit = kits.find(kit => kit.name == e.target.value);
              setSelectedKit(selectedKit)
            }}
          />
        </>
      )}
        <Field name="quantity" type="number" onChange={(e) => setQuantity(e.target.valueAsNumber)} />
        <button onClick={updateTableData} type='button'>Add to Table</button>
      </div>
      {itemType=== RequestItemType.Enum['Pre-packed Aid Kits']&&selectedKit && (
            <table id="kit-item-table">
              <thead>
                <tr>
                  <th>Kit Item Included</th>
                  <th>quantity</th>
                </tr>
              </thead>
              <tbody>
                {selectedKit.kitItems.map((kitItem) => (
                  <tr key={kitItem.itemId} >
                    <td>{kitItem.item.name}</td>
                    <td>{kitItem.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
      <div className='grid'>
        <table>
          <caption><h5>Selected Items</h5></caption>
          <thead>
            <tr>
              <th>Item Type</th>
              <th>Category</th>
              <th>Item Name</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index}>
                <td>{row.itemType}</td>
                <td>{row.category}</td>
                <td>{row.itemName}</td>
                <td>{row.quantity}</td>
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
      <div className='grid'>
          <textarea value={note} onChange={handleNoteChange} placeholder='Note'></textarea>
      </div>
      <button type='submit' onClick={()=>{

        tableData.forEach(async (row) => {
          const requestData = {
            itemType: String(row.itemType),
            itemCategory: String(row.category),
            itemName: String(row.itemName),
            quantity: Number(row.quantity),
            note: String(note),
          };
          mutate.mutate(requestData);
          if (mutate.isError) {
            console.log(mutate.error);
          }
          console.log(mutate.data);
        });
      }}>Submit</button>
    </form>
  );
}
