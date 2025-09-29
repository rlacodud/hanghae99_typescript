// 음료
interface Beverage {
  name: string; // 이름
  price: number; // 가격
}

// 사용자
interface User {
  id: number; // id
  name: string; // 이름
  role: "admin" | "customer"; // 역할(관리자 | 고객)
}

// 주문
interface Order {
  orderId: number; // 주문 id
  customerId: number; // 고객 id
  customerName: string; // 고객 이름
  beverageName: string; // 음료명
  status: "placed" | "completed" | "picked-up"; // 상태(주문 | 제작완료 | 픽업완료)
}

// 변수 정의
let beverages: Beverage[] = []; // 음료
let orders: Order[] = []; // 주문

// 관리자 여부 확인
const isAdmin = (user: User): boolean => {
  return user.role === "admin";
}

// 음료 리스트 추가
const addBeverage = (user: User, name: string, price: number): void => {
  // 관리자 분기(관리자만 추가 가능)
  if (!isAdmin(user)) {
    console.log("권한이 없습니다.");
    return;
  }

  // 인자로 받은 음료의 이름과 가격 정보를 담아 리스트 추가
  const newBeverage: Beverage = { name, price };
  beverages.push(newBeverage);
}
// 음료 제거
const removeBeverage = (user: User, beverageName: string): void => {
  // 관리자 분기(관리자만 삭제 가능)
  if (!isAdmin(user)) {
    console.log("권한이 없습니다.");
    return;
  }

  // 인자로 받은 음료의 이름과 다른 리스트만 필터링(제거)
  beverages = beverages.filter((beverage) => beverage.name !== beverageName);
}

// 음료 존재 여부 확인
const getBeverages = (user: User): Beverage[] => {
  if (!user) {
    return [];
  }
  return beverages;
}
// 음료 찾기
const findBeverage = (beverageName: string): Beverage | undefined => {
  // 인자로 받은 음료의 이름과 같은 음료 찾기
  return beverages.find((beverage) => beverage.name === beverageName);
}

const placeOrder = (user: User, beverageName: string): number => {
  // 고객 분기(고객만 주문 가능)
  if (isAdmin(user)) {
    console.log("권한이 없습니다.");
    return -1;
  }
  // 주문한 음료 정보를 beverage에 할당
  const beverage = findBeverage(beverageName);
  // 없을 경우 리턴
  if (!beverage) {
    console.log("해당 음료를 찾을 수 없습니다.");
    return -1;
  }

  // 인자로 받은 주문 정보 할당
  const newOrder: Order = {
    orderId: orders.length + 1,
    customerId: user.id,
    customerName: user.name,
    beverageName,
    status: "placed",
  };
  // 주문 리스트에 추가
  orders.push(newOrder);
  // 주문id 리턴
  return newOrder.orderId;
}

// 주문 완료 처리
const completeOrder = (user: User, orderId: number): void => {
  // 관리자 분기(관리자만 주문 완료 처리 가능)
  if (!isAdmin(user)) {
    console.log("권한이 없습니다.");
    return;
  }

  // 인자로 받은 주문id와 동일한 주문 찾기
  const order = orders.find((order) => order.orderId === orderId);
  if (order) {
    // 해당주문 제작완료 처리
    order.status = "completed";
    console.log(
      `[고객 메시지] ${order.customerName}님~ 주문하신 ${order.beverageName} 1잔 나왔습니다~`
    );
  }
}

// 픽업완료 처리
const pickUpOrder = (user: User, orderId: number): void => {
  // 고객 분기(고객만 픽업완료 처리 가능)
  if (isAdmin(user)) {
    console.log("권한이 없습니다.");
    return;
  }

  // 인자로 받은 주문id & 고객id와 동일한 주문 찾기
  const order = orders.find(
    (order) => order.orderId === orderId && order.customerId === user.id
  );
  // 해당 주문이 제작완료 상태인 경우
  if (order && order.status === "completed") {
    // 해당주문 픽업완료 처리
    order.status = "picked-up";
    console.log(
      `[어드민 메시지] 고객 ID[${order.customerId}]님이 주문 ID[${orderId}]을 수령했습니다.`
    );
  }
}

// S: 테스트용 코드
const main = () => {
  const admin: User = {
    id: 1,
    name: "바리스타",
    role: "admin",
  };

  // 유저 생성
  const member1: User = {
    id: 2,
    name: "르탄이",
    role: "customer",
  };

  const member2: User = {
    id: 3,
    name: "꿈꾸는개발자",
    role: "customer",
  };

  // 음료 등록
  addBeverage(admin, "아메리카노", 4000);
  addBeverage(admin, "카페라떼", 4500);
  addBeverage(admin, "에스프레소", 3000);

  // 음료 삭제
  removeBeverage(admin, "에스프레소");

  console.log(
    `안녕하세요~ ${
      member1.name
    } 고객님! 별다방에 오신 것을 환영합니다. 저희는 ${JSON.stringify(
      getBeverages(member1)
    )}를 판매하고 있습니다.`
  );
  // 음료 주문
  const orderId1 = placeOrder(member1, "아메리카노");
  if (orderId1 > 0) {
    setTimeout(() => {
      // 음료 제작 완료
      completeOrder(admin, orderId1);
      // 음료 수령
      pickUpOrder(member1, orderId1);
    }, 1000);
  }

  console.log(
    `안녕하세요~ ${
      member2.name
    } 고객님! 별다방에 오신 것을 환영합니다. 저희는 ${JSON.stringify(
      getBeverages(member2)
    )}를 판매하고 있습니다.`
  );
  // 음료 주문
  const orderId2 = placeOrder(member2, "카페라떼");
  if (orderId2 > 0) {
    setTimeout(() => {
      // 음료 제작 완료
      completeOrder(admin, orderId2);
      // 음료 수령
      pickUpOrder(member2, orderId2);
    }, 3000);
  }
}

main();
// E: 테스트용 코드