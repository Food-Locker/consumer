import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Plus, Minus } from 'lucide-react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import useCartStore from '../store/cartStore';
import { getImagePath } from '../utils/imageUtils';

const ItemDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [item, setItem] = useState(null);
  const [relatedItems, setRelatedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Firebase에서 아이템 정보 가져오기
  useEffect(() => {
    const fetchItem = async () => {
      try {
        // 모든 stadium에서 해당 아이템 찾기
        const stadiumsCollection = collection(db, 'stadiums');
        const stadiumsSnapshot = await getDocs(stadiumsCollection);

        for (const stadiumDoc of stadiumsSnapshot.docs) {
          const categoriesCollection = collection(db, 'stadiums', stadiumDoc.id, 'categories');
          const categoriesSnapshot = await getDocs(categoriesCollection);

          for (const categoryDoc of categoriesSnapshot.docs) {
            const brandsCollection = collection(
              db,
              'stadiums',
              stadiumDoc.id,
              'categories',
              categoryDoc.id,
              'brands'
            );
            const brandsSnapshot = await getDocs(brandsCollection);

            for (const brandDoc of brandsSnapshot.docs) {
              const itemsCollection = collection(
                db,
                'stadiums',
                stadiumDoc.id,
                'categories',
                categoryDoc.id,
                'brands',
                brandDoc.id,
                'items'
              );
              const itemsSnapshot = await getDocs(itemsCollection);

              const foundItem = itemsSnapshot.docs.find(doc => doc.id === id);
              if (foundItem) {
                const itemData = foundItem.data();
                const itemName = itemData.name || itemData.itemName || itemData.title || 'Item';
                const itemObj = {
                  id: foundItem.id,
                  ...itemData,
                  name: itemName,
                  price: itemData.price || itemData.itemPrice || 0,
                  image: getImagePath(itemName) || '/hamburger.png',
                  description: itemData.description || '맛있는 메뉴입니다.',
                  storeName: brandDoc.data().name || brandDoc.data().brandName || '매장',
                  brandId: brandDoc.id,
                  categoryId: categoryDoc.id,
                  stadiumId: stadiumDoc.id
                };
                setItem(itemObj);

                // 관련 아이템 가져오기 (같은 brand의 다른 아이템)
                const related = itemsSnapshot.docs
                  .filter(doc => doc.id !== id)
                  .slice(0, 2)
                  .map(doc => {
                    const data = doc.data();
                    const name = data.name || data.itemName || data.title || 'Item';
                    return {
                      id: doc.id,
                      name: name,
                      price: data.price || data.itemPrice || 0,
                      image: getImagePath(name) || '/hamburger.png'
                    };
                  });
                setRelatedItems(related);
                setLoading(false);
                return;
              }
            }
          }
        }

        // 아이템을 찾지 못한 경우
        setLoading(false);
      } catch (error) {
        console.error('Error fetching item:', error);
        setLoading(false);
      }
    };

    if (id) {
      fetchItem();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!item) return;
    addItem({
      ...item,
      quantity,
      options: selectedOptions,
    });
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white pb-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">메뉴 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-white pb-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">메뉴를 찾을 수 없습니다.</p>
          <Link to="/home" className="text-primary font-semibold">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="px-4 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <Link to="/search" className="text-gray-600">
            {item.storeName} &gt;
          </Link>
        </div>
      </div>

      <div className="px-4 py-6">
        <div className="w-full h-64 bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
          <img 
            src={item.image} 
            alt={item.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = '/hamburger.png';
            }}
          />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">{item.name}</h1>
        <p className="text-gray-600 mb-4">{item.description}</p>

        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">수량</h3>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded"
            >
              <Minus size={20} />
            </button>
            <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        {relatedItems.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">함께 먹으면 좋아요!</h3>
            <div className="space-y-3">
              {relatedItems.map((related) => (
                <div key={related.id} className="flex items-center bg-gray-50 rounded-lg p-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg mr-4 overflow-hidden flex-shrink-0">
                    <img 
                      src={related.image} 
                      alt={related.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/hamburger.png';
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{related.name}</h4>
                    <p className="text-primary font-semibold">{related.price.toLocaleString()}원</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-6">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">가격</span>
            <span className="text-2xl font-bold text-primary">
              {(item.price * quantity).toLocaleString()}원
            </span>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          className="w-full py-4 bg-primary text-white rounded-lg font-semibold"
        >
          장바구니에 추가
        </button>
      </div>
    </div>
  );
};

export default ItemDetailPage;

