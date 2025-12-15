import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { getImagePath } from '../utils/imageUtils';

const OrderPage = () => {
  const [selectedStadium, setSelectedStadium] = useState(null);
  const [stadiums, setStadiums] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // Firebase에서 stadiums 가져오기
  useEffect(() => {
    const fetchStadiums = async () => {
      try {
        const stadiumsCollection = collection(db, 'stadiums');
        const stadiumsSnapshot = await getDocs(stadiumsCollection);
        const stadiumsList = stadiumsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setStadiums(stadiumsList);
        if (stadiumsList.length > 0) {
          setSelectedStadium(stadiumsList[0]);
        }
      } catch (error) {
        console.error('Error fetching stadiums:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStadiums();
  }, []);

  // 선택된 Stadium의 categories 가져오기
  useEffect(() => {
    const fetchCategories = async () => {
      if (!selectedStadium) {
        setCategories([]);
        return;
      }

      try {
        const categoriesCollection = collection(db, 'stadiums', selectedStadium.id, 'categories');
        const categoriesSnapshot = await getDocs(categoriesCollection);
        const categoriesList = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCategories(categoriesList);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [selectedStadium]);

  // 선택된 Category의 brands 가져오기
  useEffect(() => {
    const fetchBrands = async () => {
      if (!selectedStadium || !selectedCategory) {
        setBrands([]);
        return;
      }

      try {
        const brandsCollection = collection(
          db,
          'stadiums',
          selectedStadium.id,
          'categories',
          selectedCategory.id,
          'brands'
        );
        const brandsSnapshot = await getDocs(brandsCollection);
        const brandsList = brandsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setBrands(brandsList);
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    };

    fetchBrands();
  }, [selectedStadium, selectedCategory]);

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="px-4 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">주문하기</h1>
      </div>

      <div className="px-4 py-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Stadium</h2>
          {loading ? (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-full animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {stadiums.map((stadium) => {
                const isSelected = selectedStadium?.id === stadium.id;
                const stadiumName = stadium.name || stadium.stadiumName || '';
                const firstTwoChars = stadiumName.substring(0, 2) || 'St';
                return (
                  <button
                    key={stadium.id}
                    onClick={() => setSelectedStadium(stadium)}
                    className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                      isSelected
                        ? 'bg-primary text-white shadow-lg ring-2 ring-primary ring-offset-2 scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {firstTwoChars}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {selectedStadium && (
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-900">Category</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const isSelected = selectedCategory?.id === category.id;
                const categoryName = category.name || category.categoryName || 'Category';
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      isSelected
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {categoryName}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {selectedStadium && selectedCategory && (
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-900">
              {selectedStadium.name || selectedStadium.stadiumName || '야구장'}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {brands.map((brand) => {
                const brandName = brand.name || brand.brandName || brand.title || 'Brand';
                return (
                  <Link
                    key={brand.id}
                    to={`/search`}
                    className="bg-white rounded-xl p-4 border border-gray-100 shadow-soft hover:shadow-medium transition-all"
                  >
                    <div className="w-full h-32 bg-gray-100 rounded-lg mb-2 flex items-center justify-center overflow-hidden">
                      <img 
                        src={getImagePath(brandName) || '/hamburger.png'} 
                        alt={brandName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/hamburger.png';
                        }}
                      />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{brandName}</h3>
                    <p className="text-primary font-semibold text-sm">메뉴 보기</p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPage;

