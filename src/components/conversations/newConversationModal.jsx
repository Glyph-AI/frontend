import React, {useState, useEFfect} from 'react';
import {
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContextText,
    DialogTitle,
    Autocomplete,
    createFilterOptions,
    TextField,
    Slide,
    Button
} from '@mui/material'
import { getRequest } from '../utility/request_helper';
import { useEffect } from 'react';

const filter = createFilterOptions()

export default function NewConversationModal({open, handleClose}) {
    const [bot, setBot] = useState(null)
    const [userBots, setUserBots] = useState([])

    const getUserBots = () => {
        getRequest("/bots", (data) => {
            setUserBots(data)
        })
    }
    
    useEffect(() => {
        getUserBots()
    }, [])

    return (
        <Dialog
            open={open}
            onClose={handleClose}
        >
            <DialogTitle>New Chat</DialogTitle>
            <DialogContent>
                <Box sx={{padding: "8px 0 8px 0", width: "100%"}}>
                    <TextField fullWidth label="Conversation Name"/>
                </Box>
                <Box sx={{padding: "8px 0 8px 0"}}>
                    
                    <Autocomplete
                        value={bot}
                        onChange={(event, newValue) => {
                            if (typeof newValue === 'string') {
                            setBot({
                                name: newValue,
                            });
                            } else if (newValue && newValue.inputValue) {
                            // Create a new value from the user input
                            setBot({
                                name: newValue.inputValue,
                            });
                            } else {
                            setBot(newValue);
                            }
                        }}
                        filterOptions={(options, params) => {
                            const filtered = filter(options, params);

                            const { inputValue } = params;
                            // Suggest the creation of a new value
                            const isExisting = options.some((option) => inputValue === option.name);
                            if (inputValue !== '' && !isExisting) {
                            filtered.push({
                                inputValue,
                                name: `Add "${inputValue}"`,
                            });
                            }

                            return filtered;
                        }}
                        selectOnFocus
                        clearOnBlur
                        handleHomeEndKeys
                        id="free-solo-with-text-demo"
                        options={userBots}
                        getOptionLabel={(option) => {
                            // Value selected with enter, right from the input
                            if (typeof option === 'string') {
                            return option;
                            }
                            // Add "xxx" option created dynamically
                            if (option.inputValue) {
                            return option.inputValue;
                            }
                            // Regular option
                            return option.name;
                        }}
                        renderOption={(props, option) => <li {...props}>{option.name}</li>}
                        sx={{ width: 300 }}
                        freeSolo
                        renderInput={(params) => (
                            <TextField {...params} label="Bot" />
                        )}
                    />
                </Box>

            </DialogContent>
            <DialogActions>
                <Button onClick={() => {handleClose()}}>Cancel</Button>
                <Button>Create</Button>
            </DialogActions>
        </Dialog>
    )
}