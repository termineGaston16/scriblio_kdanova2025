import { BrowserRouter, Route, Routes } from "react-router-dom";
import TagList from "./TAG/Presentation/Components/TagList";
import { QueryClient, QueryClientProvider } from "react-query";
import React from "react";
import { Provider } from "react-redux";
import { store } from "./UI/Application/Redux/store/storeRedux";
import { ListLocalProvider } from "./TAG/Presentation/Context/listLocalContext";
import SectionPreviousNoteList from "./NOTES/Presentation/Components/SectionPreviousNoteList";

export default function App() {

    const query = new QueryClient();

    return (
        <React.StrictMode>
            <Provider store={store}>
                <QueryClientProvider client={query}>
                    <BrowserRouter>


                        <Routes>
                            <Route path="*" element={'Page Not Found'} />

                            <Route path="/" element={<SectionPreviousNoteList />} />
                        </Routes>
                    </BrowserRouter>
                </QueryClientProvider>
            </Provider>
        </React.StrictMode>
    )
}

// ListLocalProvider: [TagList]
// ListNotesLocalProvider: [TagList]