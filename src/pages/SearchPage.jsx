import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, CheckCircle2 } from 'lucide-react';
import { api } from '../lib/mongodb';
import useCartStore from '../store/cartStore';
import { getImagePath } from '../utils/imageUtils';

const SearchPage = () => {
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const [stadiums, setStadiums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStadium, setSelectedStadium] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [brands, setBrands] = useState([]);
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // MongoDB에서 stadiums 데이터 가져오기
  useEffect(() => {
    const fetchStadiums = async () => {
      try {
        const stadiumsList = await api.getStadiums();
        setStadiums(stadiumsList);
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
        setSelectedCategory(null);
        return;
      }

      setLoadingCategories(true);
      try {
        const categoriesList = await api.getCategories(selectedStadium.id);
        setCategories(categoriesList);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [selectedStadium]);

  // 선택된 Category의 brands 가져오기
  useEffect(() => {
    const fetchBrands = async () => {
      if (!selectedStadium || !selectedCategory) {
        setBrands([]);
        setSelectedBrand(null);
        return;
      }

      setLoadingBrands(true);
      try {
        const brandsList = await api.getBrands(selectedCategory.id);
        setBrands(brandsList);
      } catch (error) {
        console.error('Error fetching brands:', error);
      } finally {
        setLoadingBrands(false);
      }
    };

    fetchBrands();
  }, [selectedStadium, selectedCategory]);

  // 선택된 Brand의 items 가져오기
  useEffect(() => {
    const fetchItems = async () => {
      if (!selectedStadium || !selectedCategory || !selectedBrand) {
        setItems([]);
        return;
      }

      setLoadingItems(true);
      try {
        const itemsList = await api.getItems(selectedBrand.id);
        setItems(itemsList);
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoadingItems(false);
      }
    };

    fetchItems();
  }, [selectedStadium, selectedCategory, selectedBrand]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedBrand(null);
    setItems([]);
  };

  const handleBrandSelect = (brand) => {
    setSelectedBrand(brand);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pb-32">
      <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/home')}
            className="mr-4"
          >
            <ArrowLeft size={24} className="text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex-1">검색</h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">구장</h2>
          {loading ? (
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="w-16 h-16 bg-gray-200 rounded-full animate-pulse mx-auto"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {stadiums.map((stadium) => {
                const isSelected = selectedStadium?.id === stadium.id;
                const stadiumName = stadium.name || stadium.stadiumName || '';
                const firstTwoChars = stadiumName.substring(0, 2) || 'St';
                
                return (
                  <button
                    key={stadium.id}
                    onClick={() => {
                      // 다른 스타디움을 선택하면 이전 선택 초기화
                      if (selectedStadium?.id !== stadium.id) {
                        setSelectedCategory(null);
                        setSelectedBrand(null);
                        setSelectedItem(null);
                        setItems([]);
                        setBrands([]);
                      }
                      setSelectedStadium(stadium);
                    }}
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-sm font-semibold mx-auto transition-all ${
                      isSelected
                        ? 'bg-primary text-white shadow-lg ring-2 ring-primary ring-offset-2 scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    title={stadiumName || '구장'}
                  >
                    {firstTwoChars}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Categories는 Stadium이 선택되었을 때만 표시 */}
        {selectedStadium && (
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-900">카테고리</h2>
            {loadingCategories ? (
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="px-4 py-2 rounded-lg bg-gray-200 animate-pulse"
                    style={{ width: '80px', height: '36px' }}
                  />
                ))}
              </div>
            ) : categories.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const isSelected = selectedCategory?.id === category.id;
                  const categoryName = category.nameKo || category.name || category.categoryName || '카테고리';
                  return (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category)}
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
            ) : (
              <p className="text-gray-500 text-sm">카테고리가 없습니다.</p>
            )}
          </div>
        )}

        {/* Brands는 Category가 선택되었을 때만 표시 */}
        {selectedStadium && selectedCategory && (
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-900">브랜드</h2>
            {loadingBrands ? (
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="px-4 py-2 rounded-lg bg-gray-200 animate-pulse"
                    style={{ width: '100px', height: '36px' }}
                  />
                ))}
              </div>
            ) : brands.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {brands.map((brand) => {
                  const isSelected = selectedBrand?.id === brand.id;
                  // DB 필드명: name 또는 다른 가능한 필드명들
                  const brandName = brand.name || brand.brandName || brand.title || '브랜드';
                  return (
                    <button
                      key={brand.id}
                      onClick={() => handleBrandSelect(brand)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        isSelected
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {brandName}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">브랜드가 없습니다.</p>
            )}
          </div>
        )}

        {/* Items는 Brand가 선택되었을 때만 표시 */}
        {selectedStadium && selectedCategory && selectedBrand && (
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-900">메뉴</h2>
            {loadingItems ? (
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-32 bg-gray-200 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            ) : items.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {items.map((item) => {
                  // DB 필드명: name 또는 다른 가능한 필드명들
                  const itemName = item.name || item.itemName || item.title || '메뉴';
                  const itemPrice = item.price || item.itemPrice || 0;
                  const itemImage = getImagePath(itemName);
                  const isSelected = selectedItem?.id === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className={`w-full bg-white rounded-xl overflow-hidden border-2 shadow-soft transition-all duration-200 ${
                        isSelected 
                          ? 'border-primary ring-2 ring-primary ring-offset-2 shadow-medium scale-[1.02]' 
                          : 'border-gray-100 hover:border-gray-200 hover:shadow-medium'
                      }`}
                    >
                      <div className="w-full h-44 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden rounded-t-xl flex items-center justify-center">
                        {itemImage ? (
                          <img 
                            src={itemImage} 
                            alt={itemName}
                            className="w-full h-full object-contain"
                            style={{ maxHeight: '100%', maxWidth: '100%' }}
                            onError={(e) => {
                              // 이미지 로드 실패 시 플레이스홀더 표시
                              e.target.style.display = 'none';
                              const placeholder = e.target.parentElement.querySelector('.image-placeholder');
                              if (placeholder) {
                                placeholder.classList.remove('hidden');
                              }
                            }}
                          />
                        ) : null}
                        <div className={`${itemImage ? 'hidden' : ''} image-placeholder w-full h-full flex items-center justify-center rounded-t-xl`}>
                          <img src="/hamburger.png" alt="placeholder" className="w-12 h-12 opacity-50" />
                        </div>
                      </div>
                      <div className="p-3 rounded-b-xl">
                        <h3 className="font-semibold text-gray-900 mb-1 text-sm">{itemName}</h3>
                        <p className="text-primary font-semibold text-sm">
                          {itemPrice.toLocaleString()}원
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">아이템이 없습니다.</p>
            )}
          </div>
        )}
      </div>

      {/* 장바구니에 담기 버튼 - 아이템이 선택되었을 때만 표시 */}
      {selectedItem && (
        <div className="fixed bottom-20 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40 mobile-container px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">선택된 아이템</p>
              <p className="font-semibold text-gray-900">
                {selectedItem.name || selectedItem.itemName || selectedItem.title || '메뉴'}
              </p>
              <p className="text-primary font-semibold text-sm mt-1">
                {(selectedItem.price || selectedItem.itemPrice || 0).toLocaleString()}원
              </p>
            </div>
            <button
              onClick={() => setSelectedItem(null)}
              className="ml-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          <button
            onClick={() => {
              const itemName = selectedItem.name || selectedItem.itemName || selectedItem.title || '메뉴';
              const itemPrice = selectedItem.price || selectedItem.itemPrice || 0;
              
              addItem({
                id: selectedItem.id,
                name: itemName,
                price: itemPrice,
                quantity: 1,
                image: getImagePath(itemName),
                brandId: selectedBrand?.id || selectedItem.brandId,
                options: {}
              });
              
              // 성공 알림 (커스텀 토스트 메시지)
              setToastMessage(`${itemName}이(가) 장바구니에 추가되었습니다.`);
              setShowToast(true);
              setSelectedItem(null);
              
              // 3초 후 자동으로 토스트 닫기
              setTimeout(() => {
                setShowToast(false);
              }, 3000);
            }}
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
          >
            <ShoppingCart size={20} />
            장바구니에 담기
          </button>
        </div>
      )}

      {/* 모달 팝업 */}
      {showToast && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowToast(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center">
              {/* 성공 아이콘 */}
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 size={40} className="text-primary" />
              </div>
              
              {/* 메시지 */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                장바구니에 추가됨
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                {toastMessage}
              </p>
              
              {/* 확인 버튼 */}
              <button
                onClick={() => {
                  setShowToast(false);
                  navigate('/cart');
                }}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;

