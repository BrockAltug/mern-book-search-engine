import { useState, useEffect } from 'react';
import {
  Container,
  Card,
  Button,
  Row,
  Col,
} from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';

import { GET_ME } from '../graphql/queries';
import { REMOVE_BOOK } from '../graphql/mutations';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  const [userData, setUserData] = useState({});

  // Use Apollo's `useQuery` to fetch user data
  const { loading, data, refetch } = useQuery(GET_ME, {
    onCompleted: (data) => {
      setUserData(data.me);
    },
    onError: (err) => {
      console.error(err);
    },
  });

  // Use Apollo's `useMutation` for deleting a book
  const [removeBook] = useMutation(REMOVE_BOOK);

  // Create function to handle deleting a book
  const handleDeleteBook = async (bookId) => {
    try {
      await removeBook({
        variables: { bookId },
      });

      // Update the UI by removing the book from state
      setUserData((prevData) => ({
        ...prevData,
        savedBooks: prevData.savedBooks.filter((book) => book.bookId !== bookId),
      }));

      // Remove the book ID from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div fluid className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className="pt-5">
          {userData.savedBooks?.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? 'book' : 'books'
              }:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks?.map((book) => (
            <Col md="4" key={book.bookId}>
              <Card border="dark">
                {book.image && (
                  <Card.Img
                    src={book.image}
                    alt={`The cover for ${book.title}`}
                    variant="top"
                  />
                )}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className="small">Authors: {book.authors.join(', ')}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button
                    className="btn-block btn-danger"
                    onClick={() => handleDeleteBook(book.bookId)}
                  >
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;