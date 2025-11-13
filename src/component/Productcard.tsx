import React from "react";
import { FaArrowRight } from "react-icons/fa";

type product = {
      id: number;
      title: string;
      description: string;
      image: string;
      offer : string;

};

function Productcard({ product }: { product:product }): React.JSX.Element {
      return (
            <div className="card w-80 bg-base-100 shadow-xl transform hover:scale-105 transition-transform duration-300 animate-fadeIn">
                  <figure className="h-48 overflow-hidden">
                        <img src={product.image} alt={product.title} className="w-full object-cover" />
                  </figure>
                  <div className="card-body">
                        <h2 className="card-title text-lg font-bold">{product.title}</h2>
                        <p className="text-sm text-gray-500">{product.description}</p>
                        <p className="text-primary font-semibold mt-2">Offer: {product.offer}</p>
                        <div className="card-actions justify-end mt-4">
                              <button className="btn btn-outline btn-sm flex items-center gap-2">
                                    Explore <FaArrowRight />
                              </button>
                        </div>
                  </div>
            </div>
      );
}

export default Productcard;