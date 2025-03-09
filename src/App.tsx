import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "./UI/Application/Redux/store/storeRedux";
import SectionPreviousNoteList from "./NOTES/Presentation/Components/SectionPreviousNoteList";
import Header from "./UI/Presentation/Components/HEADER/Presentation/Components/Header";
import React from "react";
import { IDTagParamProvider } from "./TAG/Presentation/Context/idTagParamContext";
import Toolbar from "./UI/TOOLBAR/Presentation/Components/Toolbar";
import { WordSearchProvider } from "./UI/TOOLBAR/Presentation/Context/WordSearchContext";
import NoteContainer from "./NOTES/Presentation/Components/NoteContainer";


export default function App() {

    const query = new QueryClient();

    const parametersToFilterNotes = [
        '/',
        '/favoritos',
        '/pendientes',
        '/completadas',
        '/fijas',
        '/archivadas',
    ];

    return (
        <React.StrictMode>
            <Provider store={store}>
                <QueryClientProvider client={query}>
                    <BrowserRouter>



                        <WordSearchProvider>
                            <IDTagParamProvider>
                                <Header />
                                <Toolbar />

                                <Routes>
                                    <Route path="*" element={'Page Not Found'} />

                                    {parametersToFilterNotes.map((path) => (
                                        <Route key={path} path={path} element={<SectionPreviousNoteList />} />
                                    ))}
                                    <Route path={"nota=id/:IDNote_url"} element={<NoteContainer />} />
                                </Routes>
                            </IDTagParamProvider>
                        </WordSearchProvider>

                    </BrowserRouter>
                </QueryClientProvider>
            </Provider>
        </React.StrictMode >
    )
}

// IDTagParamProvider, WordSearchProvider: Header, SectionPreviousNoteList