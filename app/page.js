'use client'
import Image from "next/image";
import { useState, useEffect } from 'react'
import { firestore } from '@/firebase'
import { Box, Modal, Typography, Stack, TextField, Button } from '@mui/material'
import { collection, doc, getDocs, query, setDoc, deleteDoc, getDoc } from "firebase/firestore";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
}

const PantryForm = ({ addItem, removeItem, updateItem }) => {
  const [itemName, setItemName] = useState('')
  const [newQuantity, setNewQuantity] = useState('')

  return (
    <Box>
      <Typography variant="h6" component="h2">
        Manage Pantry Items
      </Typography>
      <Stack spacing={2} direction="column">
        <TextField
          label="Item Name"
          variant="outlined"
          fullWidth
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />
        <TextField
          label="New Quantity"
          variant="outlined"
          fullWidth
          value={newQuantity}
          onChange={(e) => setNewQuantity(e.target.value)}
        />
        <Button variant="contained" onClick={() => addItem(itemName)}>
          Add Item
        </Button>
        <Button variant="contained" onClick={() => removeItem(itemName)}>
          Remove Item
        </Button>
        <Button variant="contained" onClick={() => updateItem(itemName, newQuantity)}>
          Update Quantity
        </Button>
      </Stack>
    </Box>
  )
}

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const updateInventory = async () => {
    const snapShot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapShot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }

    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }

    await updateInventory()
  }

  const updateItem = async (item, newQuantity) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    await setDoc(docRef, { quantity: parseInt(newQuantity) })

    await updateInventory()
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <PantryForm addItem={addItem} removeItem={removeItem} updateItem={updateItem} />
        </Box>
      </Modal>
      <Button variant="contained" onClick={handleOpen}>
        Manage Pantry
      </Button>
      <TextField
        label="Search Items"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: '20px' }}
      />
      <Box border={'1px solid #333'}>
        <Box
          width="800px"
          height="100px"
          bgcolor={'#ADD8E6'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
            Inventory Items
          </Typography>
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow={'auto'}>
          {filteredInventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              bgcolor={'#f0f0f0'}
              paddingX={5}
            >
              <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Box display={'flex'} justifyContent={'center'} alignItems={'center'} flexGrow={1}>
                <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                  {quantity}
                </Typography>
              </Box>
              <Button
                variant="contained"
                onClick={() => addItem(name)}
              >
                Add
              </Button>
              <Button
                variant="contained"
                onClick={() => removeItem(name)}
              >
                Remove
              </Button>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}







