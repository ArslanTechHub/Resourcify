import React, { useEffect, useState } from 'react';
import Loading from '../other/Loading';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { libraryItemCategories } from '../../utils/selectOptions';
import { styles } from '../../utils/selectStyles';
import { getLibraryItemById, updateLibraryItem } from '../../redux/actions/library';
import { useParams } from 'react-router-dom';
import { useAlert } from '../../utils/alert';

const UpdateLibraryItem = () => {
    const alert = useAlert();
    const { id } = useParams();
    const { loading, error, message, item } = useSelector((state) => state.library);

    const [title, setTitle] = useState('');
    const [subtitle, setSubTitle] = useState('');
    const [category, setCategory] = useState(null);
    const [author, setAuthor] = useState('');
    const [edition, setEdition] = useState('');
    const [location, setLocation] = useState('');
    const [isbn, setIsbn] = useState('');
    const [publisherCode, setPublisherCode] = useState('');
    const [copyright, setCopyright] = useState('');
    const [poster, setPoster] = useState('');

    const dispatch = useDispatch();

    const changeImageHandler = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setPoster(file);
            };
        }
    };

    const submitHandler = (e) => {
        e.preventDefault();
        const myForm = new FormData();

        myForm.append('title', title);
        myForm.append('subtitle', subtitle);
        myForm.append('type', category?.value || '');
        myForm.append('author', author);
        myForm.append('edition', edition);
        myForm.append('location', location);
        myForm.append('isbn', isbn);
        myForm.append('publisherCode', publisherCode);
        myForm.append('copyright', copyright);
        myForm.append('file', poster);

        dispatch(updateLibraryItem(id, myForm));
    };

    useEffect(() => {
        dispatch(getLibraryItemById(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (item) {
            setTitle(item.title || '');
            setSubTitle(item.subtitle || '');
            setCategory({ value: item.type, label: item.type });
            setAuthor(item.author || '');
            setEdition(item.edition || '');
            setLocation(item.location || '');
            setIsbn(item.isbn || '');
            setPublisherCode(item.publisherCode || '');
            setCopyright(item.copyright || '');
        }
    }, [item]);

    useEffect(() => {
        if (message || error) {
            alert(message, error, '/librarian');
        }
    }, [message, error, alert]);

    return loading ? (
        <Loading />
    ) : (
        <section className="!p-0">
            <form
                onSubmit={submitHandler}
                className="bg-white p-[16px] rounded-lg flex flex-col gap-[4px]"
            >
                <label>
                    <span className="inline-block mb-[4px]">Title</span>
                    <input
                        type="text"
                        placeholder="Enter Book Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </label>

                <label>
                    <span className="inline-block mb-[4px]">Subtitle</span>
                    <input
                        type="text"
                        placeholder="Enter Subtitle"
                        value={subtitle}
                        onChange={(e) => setSubTitle(e.target.value)}
                    />
                </label>

                <label>
                    <span className="inline-block mb-[4px]">Category</span>
                    <Select
                        options={libraryItemCategories}
                        placeholder="Choose Category"
                        styles={styles}
                        value={category}
                        onChange={setCategory}
                    />
                </label>

                <label>
                    <span className="inline-block mb-[4px]">Author</span>
                    <input
                        type="text"
                        placeholder="Enter Author Name"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                    />
                </label>

                <label>
                    <span className="inline-block mb-[4px]">Edition</span>
                    <input
                        type="text"
                        placeholder="Enter Edition"
                        value={edition}
                        onChange={(e) => setEdition(e.target.value)}
                    />
                </label>

                <label>
                    <span className="inline-block mb-[4px]">Location</span>
                    <input
                        type="text"
                        placeholder="Enter Location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </label>

                <label>
                    <span className="inline-block mb-[4px]">ISBN</span>
                    <input
                        type="text"
                        placeholder="Enter ISBN"
                        value={isbn}
                        onChange={(e) => setIsbn(e.target.value)}
                    />
                </label>

                <label>
                    <span className="inline-block mb-[4px]">Publisher Code</span>
                    <input
                        type="text"
                        placeholder="Enter Publisher Code"
                        value={publisherCode}
                        onChange={(e) => setPublisherCode(e.target.value)}
                    />
                </label>

                <label>
                    <span className="inline-block mb-[4px]">Copyright</span>
                    <input
                        type="text"
                        placeholder="Enter Copyright"
                        value={copyright}
                        onChange={(e) => setCopyright(e.target.value)}
                    />
                </label>

                <label>
                    <span className="inline-block mb-[4px]">Poster</span>
                    <input type="file" onChange={changeImageHandler} />
                </label>

                <button className="primary-btn !w-full inline-block mt-[4px]">
                    Submit
                </button>
            </form>
        </section>
    );
};

export default UpdateLibraryItem;
