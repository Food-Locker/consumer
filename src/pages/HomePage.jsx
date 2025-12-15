import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Settings, Bell, ChevronRight, Plus } from 'lucide-react';
import { api } from '../lib/mongodb';
import useCartStore from '../store/cartStore';
import { getImagePath, getCategoryImage } from '../utils/imageUtils';

const HomePage = () => {
  const { getItemCount, addItem } = useCartStore();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // MongoDB에서 모든 카테고리 가져오기 (모든 stadium의 categories 수집)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const stadiums = await api.getStadiums();
        const allCategoriesMap = new Map();
        
        // 모든 스타디움의 카테고리 수집
        for (const stadium of stadiums) {
          const categoriesList = await api.getCategories(stadium.id);
          
          categoriesList.forEach((cat) => {
            const categoryKey = cat.nameKo || cat.name;
            // 중복 제거: 같은 nameKo를 가진 카테고리는 하나만 유지
            if (!allCategoriesMap.has(categoryKey)) {
              allCategoriesMap.set(categoryKey, {
                ...cat,
                nameKo: cat.nameKo || cat.name || '카테고리',
                image: getCategoryImage(cat.nameKo || cat.name || '')
              });
            }
          });
        }
        
        const uniqueCategories = Array.from(allCategoriesMap.values());
        setCategories(uniqueCategories);
        
        // 첫 번째 카테고리를 기본 선택
        if (uniqueCategories.length > 0 && !selectedCategory) {
          setSelectedCategory(uniqueCategories[0].id);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // 선택된 카테고리의 모든 아이템 가져오기
  useEffect(() => {
    const fetchItems = async () => {
      if (!selectedCategory) {
        setAllItems([]);
        return;
      }

      try {
        const itemsList = await api.getAllItems(selectedCategory);
        
        const itemsWithDetails = itemsList.map(item => {
          const itemName = item.name || item.itemName || item.title || 'Item';
          return {
            ...item,
            name: itemName,
            price: item.price || item.itemPrice || 0,
            image: getImagePath(itemName) || '/hamburger.png',
            description: item.description || 'Starting From',
            categoryId: selectedCategory,
            brandId: item.brandId // brandId 명시적으로 포함
          };
        });
        
        setAllItems(itemsWithDetails);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, [selectedCategory]);

  // 선택된 카테고리에 맞는 아이템 필터링
  const recommendedItems = allItems.filter(item => item.categoryId === selectedCategory);

  const handleAddToCart = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
      brandId: item.brandId,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pb-20">
      {/* Header with Settings and Bell icons */}
      <div className="sticky top-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm z-10 px-4 pt-5 pb-6 border-b border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <Link to="/settings" className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <Settings size={22} className="text-gray-700 dark:text-gray-300" />
          </Link>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Food Locker!
          </h1>
          <Link to="/notifications" className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative">
            <Bell size={22} className="text-gray-700 dark:text-gray-300" />
            {getItemCount() > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </Link>
        </div>
        
        {/* Search Bar */}
        <Link to="/search">
          <div className="flex items-center bg-white dark:bg-gray-800 rounded-2xl px-4 py-3.5 border-2 border-gray-100 dark:border-gray-700 hover:border-primary/30 hover:shadow-md transition-all duration-200 shadow-soft">
            <Search size={20} className="text-gray-400 dark:text-gray-500 mr-3" />
            <span className="text-gray-500 dark:text-gray-400 font-medium">야구장 검색!</span>
          </div>
        </Link>
      </div>

      {/* Categories Section */}
      <div className="px-4 pt-6 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">카테고리</h2>
          <span className="text-xs text-gray-400 dark:text-gray-500">{categories.length}개</span>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide">
          {loading ? (
            <div className="flex gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex-shrink-0 w-[110px] h-[110px] bg-gray-200 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            categories.map((category) => {
              const isActive = category.id === selectedCategory;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex-shrink-0 flex flex-col items-center rounded-2xl p-5 min-w-[110px] relative transition-all duration-300 ${
                    isActive 
                      ? 'bg-gradient-to-br from-primary to-primary/90 shadow-lg scale-105 transform' 
                      : 'bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 hover:border-primary/30 hover:shadow-md hover:scale-[1.02]'
                  }`}
                >
                  {/* Category Image with gradient overlay */}
                  <div className={`w-20 h-20 mb-3 relative overflow-hidden rounded-2xl ${
                    isActive ? 'ring-2 ring-white/30' : ''
                  }`}>
                    <div className={`absolute inset-0 ${
                      isActive ? 'bg-gradient-to-br from-white/20 to-transparent' : ''
                    }`}></div>
                    <img 
                      src={category.image} 
                      alt={category.name || category.nameKo}
                      className={`w-full h-full object-cover transition-transform duration-300 ${
                        isActive ? 'scale-110' : 'hover:scale-105'
                      }`}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                  <span className={`text-sm font-bold mb-2 transition-colors ${
                    isActive ? 'text-white' : 'text-gray-800 dark:text-white'
                  }`}>
                    {category.nameKo || category.name}
                  </span>
                  {/* Arrow icon at bottom center */}
                  <div className={`absolute bottom-3 left-1/2 -translate-x-1/2 transition-all duration-300 ${
                    isActive ? 'scale-110' : ''
                  }`}>
                    <ChevronRight 
                      size={18} 
                      className={isActive ? 'text-white drop-shadow-sm' : 'text-gray-400'} 
                    />
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Recommended Section */}
      <div className="px-4 pt-2 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {categories.find(cat => cat.id === selectedCategory)?.nameKo || categories.find(cat => cat.id === selectedCategory)?.name || '메뉴'}
          </h2>
          <span className="text-xs text-primary font-semibold bg-primary/10 dark:bg-primary/20 px-2 py-1 rounded-full">
            {recommendedItems.length}개
          </span>
        </div>
        {recommendedItems.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {recommendedItems.map((item, index) => (
            <Link
              key={item.id}
              to={`/item/${item.id}`}
              className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border-2 border-gray-50 dark:border-gray-700 relative shadow-soft hover:shadow-lg transition-all duration-300 hover:scale-[1.02] hover:border-primary/20 group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Food Image with gradient overlay */}
              <div className="w-full h-52 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent z-10"></div>
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    const placeholder = e.target.parentElement.querySelector('.image-placeholder');
                    if (placeholder) {
                      e.target.style.display = 'none';
                      placeholder.classList.remove('hidden');
                    }
                  }}
                />
                <div className="hidden image-placeholder w-full h-full items-center justify-center bg-gray-100">
                  <img src="/hamburger.png" alt="placeholder" className="w-16 h-16 opacity-50" />
                </div>
                {/* Badge */}
                <div className="absolute top-2 left-2 bg-primary/90 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-md z-20">
                  인기
                </div>
              </div>
              
              {/* Content */}
              <div className="p-4 pb-16">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-base">{item.name}</h3>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{item.description}</span>
                  <span className="text-primary font-bold text-lg">${item.price}</span>
                </div>
              </div>

              {/* Plus Button */}
              <button
                onClick={(e) => handleAddToCart(e, item)}
                className={`absolute bottom-4 right-4 w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg z-10 transition-all duration-300 hover:scale-110 active:scale-95 ${
                  item.id === 1 
                    ? 'bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900' 
                    : 'bg-gradient-to-br from-primary to-primary/90 hover:from-primary/90 hover:to-primary'
                }`}
              >
                <Plus size={20} className="text-white drop-shadow-sm" />
              </button>
            </Link>
          ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>선택한 카테고리에 해당하는 메뉴가 없습니다.</p>
          </div>
        )}
      </div>

      {getItemCount() > 0 && (
        <Link
          to="/cart"
          className="fixed bottom-20 right-4 bg-gradient-to-r from-primary to-primary/90 text-white rounded-2xl px-5 py-4 shadow-lg z-40 hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          <span className="font-bold">장바구니</span>
          <span className="bg-white text-primary rounded-full px-3 py-1 text-sm font-bold shadow-md">
            {getItemCount()}
          </span>
        </Link>
      )}
    </div>
  );
};

export default HomePage;

