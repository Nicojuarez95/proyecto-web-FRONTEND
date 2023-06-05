import React, { useEffect, useState } from "react";
import "./customers.css";
import persona1 from "../../images/persona11.png"
import persona2 from "../../images/persona21.png"
import persona3 from "../../images/persona31.png"
import { useRef } from "react";
import { useDispatch } from "react-redux";
import refCustomersActions from '../../store/RefCustomers/actions'

const { refCustomers } = refCustomersActions

export default function Customers() {
  const [activeIndex, setActiveIndex] = useState(0);
  const handleNext = () => setActiveIndex((prevIndex) => prevIndex + 1);
  const handlePrev = () => setActiveIndex((prevIndex) => prevIndex - 1);

  const customers = [
    {
      name: "Jaime Foldón",
      comment: "Me encantó la experiencia de comprar en la tienda en línea. Desde el momento en que ingresé a su sitio web, pude navegar fácilmente por las diferentes categorías y encontrar lo que estaba buscando.",
      rating: 4,
      image: persona1
    },
    {
      name: "Aleja Amico",
      comment: "Recomiendo ampliamente la tienda en línea de Proyecto Web. Es fácil de usar, intuitiva y tiene una amplia variedad de productos de alta calidad que cargan sus tiendas participes.",
      rating: 5,
      image: persona2
    },
    {
      name: "Antonio Garrete",
      comment: "¡La aplicación es increíble! Desde el diseño visualmente atractivo hasta la facilidad de navegación. Además, la variedad de productos disponibles fue impresionante y pude encontrar exactamente lo que estaba buscando.",
      rating: 4,
      image: persona3
    }
  ];

  const customer = customers[activeIndex];

  let customersRef = useRef()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(refCustomers({ reference: customersRef.current }))
  }, [])

  return (
    <div ref={customersRef}>
      <div className="customers">
        <div className="cont-title-customers">
          <h2>Clientes satisfechos</h2>
        </div>

        <div className="cont-names">
          <div className="carta-names">
            <div className="img">
              <img className="img-persona" src={customer.image} alt="" />
            </div>

            <div className="cont-textos">
              <h3 className="name">{customer.name}</h3>
              <p className="coment">{customer.comment}</p>
              <div>
                {[...Array(customer.rating)].map((_, index) => (
                  <img className="estrella" src="./Vector.png" alt="" key={index} />
                ))}
              </div>
            </div>
          </div>

          <div className="controls">
            {activeIndex > 0 && (
              <button className="prev-btn" onClick={handlePrev}>
                &#8249;
              </button>
            )}
            {activeIndex < customers.length - 1 && (
              <button className="next-btn" onClick={handleNext}>
                &#8250;
              </button>
            )}
          </div>
        </div>

      </div>
      <div className="allPerson">
        <div className="cont-title-customers">
          <h2>Clientes satisfechos</h2>
        </div>
        <div className="cont-names">
          {customers.map((customer,i) => (
            <div className="carta-names" key={i}>
              <div className="img">
                <img className="img-persona" src={customer.image} alt="" />
              </div>
              <div className="cont-textos">
                <h3 className="name">{customer.name}</h3>
                <p className="coment">{customer.comment}</p>
                <div>
                  {[...Array(customer.rating)].map((_, index) => (
                    <img className="estrella" src="./Vector.png" alt="" key={index} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}