import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import React from "react";
import { Provider } from "react-redux";
import { store } from "./UI/Application/Redux/store/storeRedux";
import SectionPreviousNoteList from "./NOTES/Presentation/Components/SectionPreviousNoteList";
import { ListNotesLocalProvider } from "./NOTES/Presentation/Context/listNotesLocalContext";
import Header from "./UI/Presentation/Components/HEADER/Presentation/Components/Header";

export default function App() {

    const query = new QueryClient();

    return (
        <React.StrictMode>
            <Provider store={store}>
                <QueryClientProvider client={query}>
                    <BrowserRouter>

                        <Header />

                        <ListNotesLocalProvider>
                            <Routes>
                                <Route path="*" element={'Page Not Found'} />

                                <Route path="/" element={<SectionPreviousNoteList />} />
                            </Routes>
                        </ListNotesLocalProvider>
                    </BrowserRouter>
                </QueryClientProvider>
            </Provider>
        </React.StrictMode >
    )
}

// ListLocalProvider: [TagList]
// ListNotesLocalProvider: [SectionPreviousNoteList]